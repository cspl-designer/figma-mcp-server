// lib/parser.js
const fs = require('fs');
const path = require('path');
const { extractVisualSpec } = require('./style_extractor'); // ✅ Import the new extractor

const ROOT_COMPONENT_DIR = './src/components';
let COMPONENT_REGISTRY = new Set();
const generationQueue = new Set();

// --- 1. REGISTRY SCANNER (Retained) ---
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

// --- 2. VARIANT EXTRACTOR (Retained) ---
function extractVariantProps(node) {
    const p = {};
    if (node.componentProperties) {
        for (const [k, v] of Object.entries(node.componentProperties)) {
            if (v.type === 'VARIANT' || v.type === 'BOOLEAN') p[k.split('#')[0].toLowerCase()] = v.value;
        }
    }
    return p;
}

// --- 3. DEPENDENCY SCANNER (Retained) ---
// Scans inside instances to find "Grandchildren" that need to be generated
function scanForHiddenDependencies(children) {
    if (!children) return;
    children.forEach(child => {
        if (child.type === 'INSTANCE') {
            const name = child.name.split('/').pop().trim();
            if (!COMPONENT_REGISTRY.has(name)) {
                // Queue this dependency: Name | MasterID | ReferenceID
                generationQueue.add(`${name}|${child.componentId || 'Unknown'}|${child.id}`);
            }
        }
        // Recursively scan grand-children
        if (child.children) {
            scanForHiddenDependencies(child.children);
        }
    });
}

// --- 4. MAIN PARSER (Merged Logic) ---
function parseFigmaNode(node, tokenLookup) { // ✅ Accepts tokenLookup
    if (!node) return null;
    const { name, type } = node;

    // A. Generate the Visual Spec (The Source of Truth)
    const visualSpec = extractVisualSpec(node, tokenLookup);

    // B. Handle Instances (The Agent Logic)
    if (type === 'INSTANCE') {
        const componentName = name.split('/').pop().trim();
        const isExisting = COMPONENT_REGISTRY.has(componentName);

        // 1. Add Self to Queue if missing
        if (!isExisting) {
            generationQueue.add(`${componentName}|${node.componentId || 'Unknown'}|${node.id}`);
        }

        // 2. Peek inside to find hidden dependencies
        if (node.children) {
            scanForHiddenDependencies(node.children);
        }

        return {
            type: 'COMPONENT_INSTANCE',
            componentName,
            isLibraryComponent: isExisting,
            props: extractVariantProps(node),
            visualSpec, // ✅ Attached Visual Spec
            children: [] // Keep empty for Parent generation
        };
    }

    // C. Handle Elements (Text/Frames/Vectors)
    const parsed = {
        id: node.id,
        name,
        type: type === 'TEXT' ? 'TEXT' : 'CONTAINER',
        visualSpec, // ✅ Attached Visual Spec
        props: {},
        children: []
    };

    if (type === 'TEXT') {
        parsed.text = node.characters;
    }

    if (node.children) {
        parsed.children = node.children
            .map(child => parseFigmaNode(child, tokenLookup)) // ✅ Pass lookup recursively
            .filter(Boolean);
    }

    return parsed;
}

// --- 5. QUEUE HELPERS (Retained) ---
function popFromGenerationQueue() {
    if (generationQueue.size === 0) return null;
    const val = generationQueue.values().next().value;
    generationQueue.delete(val);
    const [name, masterId, refId] = val.split('|');
    return { name, id: masterId, refId };
}

function removeFromGenerationQueue(itemStr) {
    generationQueue.delete(itemStr);
}

function getGenerationQueue() { return Array.from(generationQueue); }
function refreshRegistry() { scanComponentRegistry(); }

module.exports = {
    parseFigmaNode,
    getGenerationQueue,
    popFromGenerationQueue,
    removeFromGenerationQueue,
    refreshRegistry
};