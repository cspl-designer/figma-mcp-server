// lib/api.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { FIGMA_TOKEN, GEMINI_VISION_API_URL, GEMINI_TEXT_API_URL } = require('../config.js');

const { parseFigmaNode, simplifyTree, createLayoutBlueprint, getCachedVariants } = require('./parser');
const { generateDeterministicCSS } = require('./css_generator'); // Using your new generator
const { generateBuildPlan, fetchNodeWithRetry } = require('./dependency_graph');
const { buildTokenMap } = require('./token_map');

const GLOBAL_CSS_PATH = './src/global.css';
const LAYOUT_RULES_PATH = './src/layout_rules.md';
const PREVIEW_DIR = './previews';
const PROPS_REGISTRY = {};
const PRICE_INPUT_PER_1M = 0.075;
const PRICE_OUTPUT_PER_1M = 0.30;

function getGlobalCSS() { try { return fs.existsSync(GLOBAL_CSS_PATH) ? fs.readFileSync(GLOBAL_CSS_PATH, 'utf8') : ""; } catch (e) { return ""; } }
function getLayoutRules() { try { return fs.existsSync(LAYOUT_RULES_PATH) ? fs.readFileSync(LAYOUT_RULES_PATH, 'utf8') : ""; } catch (e) { return ""; } }
async function getFigmaNodeData(fileKey, nodeId) { return await fetchNodeWithRetry(fileKey, nodeId); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hasDeepInstances(node) {
  if (!node) return false;
  if (node.children) {
    for (const child of node.children) {
      if (child.type === 'COMPONENT_INSTANCE') return true;
      if (hasDeepInstances(child)) return true;
    }
  }
  return false;
}

function determineStrategy(node) {
  if (hasDeepInstances(node)) return 'ORCHESTRATION';
  return 'ATOMIC';
}

async function buildComponentPayload(node, tokenLookup) {
  let baseJson = parseFigmaNode(node, tokenLookup);
  let simplifiedJson = simplifyTree(baseJson);
  const strategy = determineStrategy(simplifiedJson);
  let finalPayload;

  if (strategy === 'ORCHESTRATION') {
    finalPayload = createLayoutBlueprint(simplifiedJson, true);
    finalPayload._strategy = "BLUEPRINT";
  } else {
    finalPayload = simplifiedJson;
    finalPayload._strategy = "ATOMIC";
  }

  const variants = getCachedVariants(baseJson.name);
  if (variants && variants.length > 0) {
    finalPayload._known_variants = variants;
  }
  return finalPayload;
}

function saveDebugJson(componentName, data) {
  if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR);
  const filePath = path.join(PREVIEW_DIR, `preview_${componentName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`   📄 Preview JSON saved: ${filePath}`);
}

function saveCSSFile(componentName, cssContent) {
  const safeName = componentName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const baseDir = './src/components';
  const componentDir = path.join(baseDir, safeName);
  if (!fs.existsSync(componentDir)) fs.mkdirSync(componentDir, { recursive: true });

  const filePath = path.join(componentDir, `${safeName}.module.css`);
  fs.writeFileSync(filePath, cssContent);
  console.log(`   🎨 CSS generated: ${filePath}`);
}

function unwrapCode(rawString, type) {
  if (!rawString) return "";
  let clean = rawString.trim();
  clean = clean.replace(/^```(tsx|jsx|css|json|typescript)?\s*/, '').replace(/\s*```$/, '');
  if (clean.startsWith('{')) {
    try {
      const parsed = JSON.parse(clean);
      if (type === 'css' && parsed.css) return parsed.css;
      if (type === 'tsx' && parsed.tsx) return parsed.tsx;
      if (parsed[type]) return parsed[type];
    } catch (e) { }
  }
  return clean;
}

function logTokenUsage(componentName, metadata) {
  if (!metadata) return;
  const inputTokens = metadata.promptTokenCount || 0;
  const outputTokens = metadata.candidatesTokenCount || 0;
  const inputCost = (inputTokens / 1000000) * PRICE_INPUT_PER_1M;
  const outputCost = (outputTokens / 1000000) * PRICE_OUTPUT_PER_1M;
  const totalCost = inputCost + outputCost;
  console.log(`   💰 [COST] Tokens: ${inputTokens} in / ${outputTokens} out | Est: $${totalCost.toFixed(5)}`);
}

async function generateComponentParts(prompt, componentName) {
  console.log(`[API] 🧠 Generating TSX for ${componentName}...`);
  const tsxPrompt = `${prompt}\n\nIMPORTANT: Return ONLY raw TSX code. No JSON.`;

  try {
    const tsxRes = await fetch(GEMINI_TEXT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: tsxPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
      })
    });
    const tsxData = await tsxRes.json();
    logTokenUsage(componentName + " (TSX)", tsxData.usageMetadata);

    const tsx = unwrapCode(tsxData.candidates?.[0]?.content?.parts?.[0]?.text || "", 'tsx');
    return { tsx, css: "", propsDefinition: "" };

  } catch (e) {
    console.error(`[ERROR] Generation failed: ${e.message}`);
    throw e;
  }
}

async function saveTSXFile(originalName, tsxCode) {
  const safeName = originalName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const componentDir = path.join('./src/components', safeName);
  if (!fs.existsSync(componentDir)) fs.mkdirSync(componentDir, { recursive: true });
  fs.writeFileSync(path.join(componentDir, `${safeName}.tsx`), tsxCode);
  console.log(`[FILE] 💾 Saved TSX: ${safeName}.tsx`);
}

async function waitForConfirmation() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('\n❓ Preview JSONs & CSS files created. Proceed to AI TSX Generation? (y/n): ', (answer) => {
      rl.close();
      if (answer.toLowerCase().startsWith('y')) resolve(true);
      else { console.log('🛑 Operation cancelled.'); resolve(false); }
    });
  });
}

function printDependencyTree(rootName, dependencyMap, buildOrder) {
  console.log('\n[PLAN] 🌳 Dependency Tree:');
  const getType = (name) => {
    const item = buildOrder.find(i => i.name === name);
    return item ? `[${item.type}]` : '';
  };
  function printNode(name, prefix = '', isLast = true) {
    const connector = isLast ? '└── ' : '├── ';
    console.log(`${prefix}${connector}${name} ${getType(name)}`);
    const children = dependencyMap[name] || [];
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    children.forEach((child, index) => {
      printNode(child, childPrefix, index === children.length - 1);
    });
  }
  printNode(rootName);
  console.log('----------------------------------------');
}

// --- MAIN ORCHESTRATOR ---
async function handleFigmaToCode(fileKey, initialNodeId, promptTemplate) {
  console.log('[ORCHESTRATOR] 🚀 Starting Build Process...');

  let tokenData = { lookup: () => null, cssContent: "" };
  try {
    tokenData = await buildTokenMap(fileKey);
    if (!fs.existsSync('./src')) fs.mkdirSync('./src');
    fs.writeFileSync(GLOBAL_CSS_PATH, tokenData.cssContent);
  } catch (e) { }

  const { buildOrder, dependencyMap } = await generateBuildPlan(fileKey, initialNodeId);
  const rootItem = buildOrder.find(i => i.id === initialNodeId) || buildOrder[buildOrder.length - 1];

  printDependencyTree(rootItem.name, dependencyMap, buildOrder);

  // 1. PRE-SCAN (Cache Population)
  console.log(`\n[PRE-SCAN] 🔍 Deep scanning for variants...`);
  for (let i = buildOrder.length - 1; i >= 0; i--) {
    const task = buildOrder[i];
    try {
      let node = await getFigmaNodeData(fileKey, task.id);
      if (!node && task.refId) node = await getFigmaNodeData(fileKey, task.refId);
      if (node) parseFigmaNode(node, tokenData.lookup);
    } catch (e) { }
  }
  console.log(`[PRE-SCAN] ✅ Cache populated.`);

  // 2. PREVIEW PHASE (Generate Data + CSS)
  console.log('\n[PREVIEW] 🛠️  Generating Data & CSS (Local Processing)...');

  const payloadCache = new Map();

  for (const task of buildOrder) {
    let node = await getFigmaNodeData(fileKey, task.id);
    if ((!node || !node.children || node.children.length === 0) && task.refId) {
      node = await getFigmaNodeData(fileKey, task.refId);
    }
    if (node) {
      // A. Build Basic Payload
      const rawPayload = await buildComponentPayload(node, tokenData.lookup);

      // B. Generate Deterministic CSS & Enriched JSON (Class Names)
      const { cssContent, updatedJson } = generateDeterministicCSS(rawPayload);

      // C. Save Artifacts IMMEDIATELY
      saveDebugJson(task.name, updatedJson); // Save JSON with classNames
      saveCSSFile(task.name, cssContent);   // Save CSS file to disk

      // D. Cache for the next step
      payloadCache.set(task.name, { updatedJson, cssContent });
    }
  }

  // 3. CONFIRMATION
  // User can now check the 'previews' folder AND 'src/components' folder 
  // to see the JSON and CSS before proceeding.
  const proceed = await waitForConfirmation();
  if (!proceed) return [];

  // 4. AI GENERATION PHASE (TSX Only)
  const builtResults = [];
  const completedNames = new Set();

  for (const task of buildOrder) {
    const componentName = task.name;
    const safeName = componentName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // ✅ FIX: Restore the skip logic
    const expectedPath = path.join('./src/components', safeName, `${safeName}.tsx`);
    if (fs.existsSync(expectedPath)) {
      console.log(`[ORCHESTRATOR] ⏩ Skipping ${componentName} (Already exists)`);
      completedNames.add(componentName); // Mark as done so parents can still import it
      continue;
    }

    if (completedNames.has(componentName)) continue;


    console.log(`[ORCHESTRATOR] 🏗️  Building TSX: ${componentName}`);

    // Retrieve the Enriched JSON we generated in the Preview Phase
    const cachedData = payloadCache.get(componentName);

    if (cachedData && cachedData.updatedJson) {
      // Prepare Manifest
      const myChildren = dependencyMap[componentName] || [];
      const componentManifest = {};
      let childInterfaces = "";
      myChildren.forEach(childName => {
        const lowerName = childName.toLowerCase();
        componentManifest[childName] = { type: "COMPONENT_INSTANCE", importPath: `../${lowerName}/${lowerName}` };
        if (PROPS_REGISTRY[childName]) childInterfaces += `\n// Interface <${childName} />\n${PROPS_REGISTRY[childName]}\n`;
      });

      // Update Prompt
      const currentPrompt = promptTemplate
        .replace('{{COMPONENT_NAME}}', componentName)
        .replace('{{CSS_FILE_NAME}}', safeName)
        .replace('{{STRUCTURED_JSON}}', JSON.stringify(cachedData.updatedJson, null, 2)) // Use Enriched JSON
        .replace('{{CHILD_COMPONENT_MANIFEST}}', JSON.stringify(componentManifest, null, 2))
        .replace('{{CHILD_INTERFACES}}', childInterfaces)
        .replace('{{GLOBAL_CSS}}', tokenData.cssContent)
        .replace('{{LAYOUT_RULES}}', getLayoutRules());

      try {
        // Call AI
        const parsedCode = await generateComponentParts(currentPrompt, componentName);

        // Save TSX (CSS is already saved)
        await saveTSXFile(componentName, parsedCode.tsx);

        if (parsedCode.propsDefinition) PROPS_REGISTRY[componentName] = parsedCode.propsDefinition;
        builtResults.push(componentName);
        completedNames.add(componentName);
      } catch (err) { console.error(`[ERROR] Failed to build ${componentName}: ${err.message}`); }
    }
    await sleep(500);
  }

  console.log(`\n[ORCHESTRATOR] ✅ All tasks complete.`);
  return builtResults;
}

module.exports = { handleFigmaToCode };