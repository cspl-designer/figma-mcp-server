// lib/parser.js
const fs = require('fs');
const path = require('path');
const { extractVisualSpec } = require('./style_extractor');

const ROOT_COMPONENT_DIR = './src/components';
let COMPONENT_REGISTRY = new Set();
const generationQueue = new Set();
const VARIANT_CACHE = {};

function scanComponentRegistry(directory = ROOT_COMPONENT_DIR) {
  try {
    const absolutePath = path.resolve(process.cwd(), directory);
    if (!fs.existsSync(absolutePath)) return;
    const items = fs.readdirSync(absolutePath, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        COMPONENT_REGISTRY.add(item.name);
        scanComponentRegistry(path.join(directory, item.name));
      } else if (item.isFile()) {
        const ext = path.extname(item.name);
        if (['.tsx', '.jsx'].includes(ext)) {
          const name = path.basename(item.name, ext);
          if (name !== 'index') COMPONENT_REGISTRY.add(name);
        }
      }
    });
  } catch (e) { }
}
scanComponentRegistry();

// --- HELPERS ---

function normalizePropName(rawName) {
  return rawName.split('#')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function extractVariantProps(node) {
  const p = {};
  if (node.componentProperties) {
    for (const [k, v] of Object.entries(node.componentProperties)) {
      if (v.type === 'VARIANT' || v.type === 'BOOLEAN') {
        const cleanKey = normalizePropName(k);
        p[cleanKey] = v.value;
      }
    }
  }
  return p;
}

function findInstancesRecursive(node) {
  if (!node) return;
  if (node.type === 'INSTANCE') {
    const componentName = node.name.split('/').pop().trim();
    if (!COMPONENT_REGISTRY.has(componentName)) {
      generationQueue.add(`${componentName}|${node.componentId || 'Unknown'}|${node.id}`);
    }
  }
  if (node.children) node.children.forEach(child => findInstancesRecursive(child));
}

// ✅ FIXED: Checks for both 'characters' (Raw Figma) and 'text' (Parsed Node)
function extractDeepText(node) {
  if (!node) return null;

  // 1. Direct Text Match
  // FIX: Check node.text OR node.characters
  const textContent = node.text || node.characters;
  if (node.type === 'TEXT' && textContent && textContent.trim().length > 0) {
    return textContent.trim();
  }

  // 2. Recursive Search
  if (node.children) {
    // Priority Search
    const priorityChild = node.children.find(c =>
      ['Label', 'Value', 'Text', 'Content', 'Title', 'Desc'].some(tag => (c.name || "").includes(tag))
    );
    if (priorityChild) {
      const found = extractDeepText(priorityChild);
      if (found) return found;
    }

    // Fallback Search
    for (const child of node.children) {
      const found = extractDeepText(child);
      if (found) return found;
    }
  }
  return null;
}

function cacheVariant(componentName, props, children, visualSpec) {
  if (!VARIANT_CACHE[componentName]) {
    VARIANT_CACHE[componentName] = [];
  }
  const propSig = JSON.stringify(props);
  const childStructure = children ? children.map(c => c.componentName || c.type).join(',') : "Empty";
  const signature = `${propSig}|${childStructure}`;

  const exists = VARIANT_CACHE[componentName].some(v => v._signature === signature);
  if (!exists) {
    VARIANT_CACHE[componentName].push({
      props,
      children,
      visualSpec,
      _signature: signature
    });
  }
}

// --- MAIN PARSER ---

function parseFigmaNode(node, tokenLookup) {
  if (!node) return null;
  const { name, type } = node;
  const visualSpec = extractVisualSpec(node, tokenLookup);

  if (type === 'INSTANCE') {
    const componentName = name.split('/').pop().trim();
    const isExisting = COMPONENT_REGISTRY.has(componentName);

    if (!isExisting) generationQueue.add(`${componentName}|${node.componentId || 'Unknown'}|${node.id}`);
    if (node.children) findInstancesRecursive({ children: node.children });

    const rawProps = extractVariantProps(node);

    // Recurse first so we have fully parsed children
    const processedChildren = node.children
      ? node.children.map(child => parseFigmaNode(child, tokenLookup)).filter(Boolean)
      : [];

    cacheVariant(componentName, rawProps, processedChildren, visualSpec);

    // ✅ EXTRACT: Now that processedChildren have '.text' properties, this will work.
    const inferredText = extractDeepText({ children: processedChildren });

    return {
      type: 'COMPONENT_INSTANCE',
      name: componentName,
      componentName,
      isLibraryComponent: isExisting,
      props: rawProps,
      visualSpec,
      children: processedChildren,
      _inferred_content: inferredText // <--- Correctly populated now
    };
  }

  const parsed = {
    id: node.id,
    name,
    type: type === 'TEXT' ? 'TEXT' : 'CONTAINER',
    visualSpec,
    props: {},
    children: []
  };

  if (type === 'TEXT') parsed.text = node.characters; // Store text here
  if (node.children) parsed.children = node.children.map(child => parseFigmaNode(child, tokenLookup)).filter(Boolean);

  return parsed;
}

function createLayoutBlueprint(node, isRoot = false, keepVisuals = false) {
  if (!node) return null;

  if (!isRoot && node.type === 'COMPONENT_INSTANCE') {
    const finalProps = { ...node.props };

    // ✅ PASS THE TEXT
    if (node._inferred_content) {
      finalProps.children = node._inferred_content;
      finalProps._inferred_content = node._inferred_content;
    }

    const blueprint = {
      type: 'COMPONENT_INSTANCE',
      name: node.name,
      componentName: node.componentName,
      props: finalProps,
      visualSpec: {
        box: { display: node.visualSpec?.box?.display }
      },
      children: [],
      isBlueprint: true,
      _inferred_content: node._inferred_content
    };

    if (keepVisuals && node.visualSpec) blueprint.visualSpec = node.visualSpec;

    return blueprint;
  }

  const clone = { ...node };
  if (node.children && node.children.length > 0) {
    clone.children = node.children.map(child => createLayoutBlueprint(child, false, keepVisuals)).filter(Boolean);
  }
  return clone;
}

function simplifyTree(node) {
  if (!node.children || node.children.length === 0) return node;
  node.children = node.children.map(child => simplifyTree(child));
  const box = node.visualSpec?.box;
  const isSignificant = box && (
    (box.backgroundColor && box.backgroundColor !== 'transparent') ||
    (box.borderWidth && box.borderWidth !== '0px') ||
    (box.padding && box.padding !== '0px 0px 0px 0px') ||
    (box.display === 'flex' && node.children.length > 1)
  );
  if (node.type === 'CONTAINER' && !isSignificant && node.children.length === 1) {
    return node.children[0];
  }
  return node;
}

function getCachedVariants(componentName) {
  const rawVariants = VARIANT_CACHE[componentName];
  if (!rawVariants) return null;
  return rawVariants.map(variant => {
    const fullChildren = variant.children
      ? variant.children.map(child => createLayoutBlueprint(child, false, true))
      : [];
    return {
      props: variant.props,
      children: fullChildren,
      visualSpec: variant.visualSpec,
      _signature: variant._signature
    };
  });
}

function popFromGenerationQueue() {
  if (generationQueue.size === 0) return null;
  const val = generationQueue.values().next().value;
  generationQueue.delete(val);
  const parts = val.split('|');
  return parts.length === 3 ? { name: parts[0], id: parts[1], refId: parts[2] } : { name: parts[0], id: parts[1] };
}

function removeFromGenerationQueue(itemStr) { generationQueue.delete(itemStr); }
function getGenerationQueue() { return Array.from(generationQueue); }
function refreshRegistry() { scanComponentRegistry(); }

module.exports = {
  parseFigmaNode,
  simplifyTree,
  createLayoutBlueprint,
  getGenerationQueue,
  popFromGenerationQueue,
  removeFromGenerationQueue,
  refreshRegistry,
  findInstancesRecursive,
  getCachedVariants
};