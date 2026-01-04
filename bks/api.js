// lib/api.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { FIGMA_TOKEN, GEMINI_VISION_API_URL, GEMINI_TEXT_API_URL } = require('../config.js');
const { parseFigmaNode } = require('./parser');
const { generateBuildPlan, fetchNodeWithRetry } = require('./dependency_graph');
const { buildTokenMap } = require('./token_map');

// --- CONFIGURATION ---
const GLOBAL_CSS_PATH = './src/global.css';
const LAYOUT_RULES_PATH = './src/layout_rules.md';

// --- STATE ---
const PROPS_REGISTRY = {};

// --- HELPERS ---
function getGlobalCSS() {
    try { return fs.existsSync(GLOBAL_CSS_PATH) ? fs.readFileSync(GLOBAL_CSS_PATH, 'utf8') : ""; }
    catch (e) { return ""; }
}

function getLayoutRules() {
    try { return fs.existsSync(LAYOUT_RULES_PATH) ? fs.readFileSync(LAYOUT_RULES_PATH, 'utf8') : ""; }
    catch (e) { return ""; }
}

async function getFigmaNodeData(fileKey, nodeId) {
    return await fetchNodeWithRetry(fileKey, nodeId);
}

async function getFigmaScreenshotUrl(fileKey, nodeId) {
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&scale=2`;
    const response = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.images && Object.values(data.images)[0];
}

async function getVisualDescriptionFromGemini(imageUrl) {
    if (!imageUrl) return "No visual description available.";
    console.log('[API] 👁️  Analyzing visual screenshot...');
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();
    const payload = {
        contents: [{
            parts: [
                { text: "Analyze this UI component. Describe its layout, visible nested components, and visual hierarchy." },
                { inlineData: { mimeType: "image/png", data: imageBuffer.toString('base64') } }
            ]
        }]
    };
    const response = await fetch(GEMINI_VISION_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) return "Visual analysis failed.";
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "No description.";
}

async function generateCodeFromGemini(prompt, visualDescription, screenshotUrl) {
    console.log('[API] 🧠 Generating code...');
    const fullPrompt = `${prompt}\n\n--- VISUAL CONTEXT ---\nVisual Description: ${visualDescription}\nScreenshot URL: ${screenshotUrl}`;
    const payload = { contents: [{ parts: [{ text: fullPrompt }] }], generationConfig: { temperature: 0.1 } };
    const response = await fetch(GEMINI_TEXT_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```(tsx|jsx|typescript|javascript|css|json)?/g, '').trim();
}

async function saveComponentToFile(originalName, tsxCode, cssCode) {
    const safeName = originalName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const baseDir = './src/components';
    const componentDir = path.join(baseDir, safeName);
    if (!fs.existsSync(componentDir)) fs.mkdirSync(componentDir, { recursive: true });
    fs.writeFileSync(path.join(componentDir, `${safeName}.tsx`), tsxCode);
    fs.writeFileSync(path.join(componentDir, `${safeName}.module.css`), cssCode);
    console.log(`[FILE] 💾 Saved ${safeName} to ${componentDir} (Lc)`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function printDependencyTree(rootName, dependencyMap, buildOrder) {
    console.log('\n[PLAN] 🌳 Dependency Tree (Scan Results):');
    console.log('----------------------------------------');
    const getType = (name) => {
        const item = buildOrder.find(i => i.name === name);
        return item ? `[${item.type}]` : '';
    };
    function printNode(name, prefix = '', isLast = true) {
        const connector = isLast ? '└── ' : '├── ';
        const typeLabel = getType(name);
        console.log(`${prefix}${connector}${name} ${typeLabel}`);
        const children = dependencyMap[name] || [];
        const childPrefix = prefix + (isLast ? '    ' : '│   ');
        children.forEach((child, index) => {
            printNode(child, childPrefix, index === children.length - 1);
        });
    }
    printNode(rootName);
    console.log('----------------------------------------\n');
}

// ✅ NEW: VISUAL SPEC PREVIEWER
async function previewVisualSpecs(fileKey, buildOrder, tokenLookup) {
    console.log('\n[SPEC] 🎨 Detected Visual Specifications (Dry Run):');
    console.log('==================================================');

    for (const task of buildOrder) {
        // We fetch the node (it should be cached from the graph scan)
        let node = await getFigmaNodeData(fileKey, task.id);

        // Fallback logic for empty masters
        if ((!node || !node.children || node.children.length === 0) && task.refId) {
            const fallback = await getFigmaNodeData(fileKey, task.refId);
            if (fallback) node = fallback;
        }

        if (!node) continue;

        // Run the Extractor
        const parsed = parseFigmaNode(node, tokenLookup);
        const spec = parsed.visualSpec;

        console.log(`\n🔹 ${task.name} [${task.type}]`);

        if (spec.box) {
            const b = spec.box;
            const parts = [];
            if (b.display) parts.push(`Layout: ${b.display} ${b.flexDirection || ''}`);
            if (b.gap && b.gap !== '0px') parts.push(`Gap: ${b.gap}`);
            if (b.padding && b.padding !== '0px 0px 0px 0px') parts.push(`Pad: ${b.padding}`);
            if (b.backgroundColor) parts.push(`Bg: ${b.backgroundColor}`);
            if (b.borderRadius) parts.push(`Radius: ${b.borderRadius}`);
            if (b.width && b.height) parts.push(`Size: ${b.width}x${b.height}`);

            console.log(`   📦 BOX:  ${parts.join(' | ')}`);
        }

        if (spec.typography) {
            const t = spec.typography;
            console.log(`   Aa TYPO: ${t.fontFamily} | ${t.fontSize} | ${t.fontWeight} | ${t.color}`);
        } else if (parsed.children && parsed.children.length > 0) {
            // Peek at first child to see if it has text (optional)
            const firstText = parsed.children.find(c => c.type === 'TEXT');
            if (firstText && firstText.visualSpec.typography) {
                const t = firstText.visualSpec.typography;
                console.log(`   Aa TYPO (Child): ${t.fontSize} ${t.fontWeight} ${t.color}`);
            }
        }
    }
    console.log('==================================================\n');
}

async function waitForConfirmation() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question('❓ Do you want to proceed with code generation? (y/n): ', (answer) => {
            rl.close();
            if (answer.toLowerCase().startsWith('y')) resolve(true);
            else { console.log('🛑 Operation cancelled.'); resolve(false); }
        });
    });
}

// --- MAIN ORCHESTRATOR ---
async function handleFigmaToCode(fileKey, initialNodeId, promptTemplate) {
    console.log('[ORCHESTRATOR] 🚀 Starting Bottom-Up Build Process...');

    // 1. INITIALIZE TOKENS
    let tokenData = { lookup: () => null, cssContent: "" };
    try {
        tokenData = await buildTokenMap(fileKey);
        const globalCssPath = './src/global.css';
        if (!fs.existsSync('./src')) fs.mkdirSync('./src');
        fs.writeFileSync(globalCssPath, tokenData.cssContent);
        console.log(`[FILE] 💾 Saved global.css (Mapped ${tokenData.cssContent.length} chars)`);
    } catch (e) {
        console.warn("[WARN] Token mapping failed:", e.message);
    }

    // 2. SCAN GRAPH
    const { buildOrder, dependencyMap } = await generateBuildPlan(fileKey, initialNodeId);
    const rootItem = buildOrder.find(i => i.id === initialNodeId) || buildOrder[buildOrder.length - 1];
    const rootName = rootItem ? rootItem.name : "Unknown";

    // 3. VISUALIZATION
    printDependencyTree(rootName, dependencyMap, buildOrder);

    // ✅ NEW: Run the Spec Preview
    await previewVisualSpecs(fileKey, buildOrder, tokenData.lookup);

    // 4. CONFIRMATION
    const proceed = await waitForConfirmation();
    if (!proceed) return [];

    const layoutRulesContent = getLayoutRules();
    const builtResults = [];
    const completedNames = new Set();

    // 5. EXECUTE BUILD
    for (const task of buildOrder) {
        const componentName = task.name;
        if (completedNames.has(componentName)) continue;

        console.log(`[ORCHESTRATOR] 🏗️  BUILDING: ${componentName} ...`);

        let node = await getFigmaNodeData(fileKey, task.id);
        if ((!node || !node.children || node.children.length === 0) && task.refId) {
            console.log(`   > ⚠️  Master is empty. Falling back to Instance ${task.refId}...`);
            const fallbackNode = await getFigmaNodeData(fileKey, task.refId);
            if (fallbackNode) node = fallbackNode;
        }

        if (!node) {
            console.error(`   > ❌ Failed to get data for ${componentName}. Skipping.`);
            continue;
        }

        const structuredJson = parseFigmaNode(node, tokenData.lookup);

        // --- MANIFEST & CONTRACTS ---
        const myChildren = dependencyMap[componentName] || [];
        const availableImports = myChildren.filter(childName => completedNames.has(childName));

        const componentManifest = {};
        let childInterfaces = "";

        if (availableImports.length > 0) {
            availableImports.forEach(childName => {
                const lowerName = childName.toLowerCase();
                componentManifest[childName] = {
                    type: "COMPONENT_INSTANCE",
                    importPath: `../${lowerName}/${lowerName}`,
                    status: "READY"
                };
                if (PROPS_REGISTRY[childName]) {
                    childInterfaces += `\n// --- Interface for <${childName} /> ---\n${PROPS_REGISTRY[childName]}\n`;
                } else {
                    childInterfaces += `\n// ⚠️ No interface found for ${childName}. Use standard props.\n`;
                }
            });
        }

        const manifestString = Object.keys(componentManifest).length > 0 ? JSON.stringify(componentManifest, null, 2) : "No detected child components.";
        const interfaceString = childInterfaces || "No child components detected.";

        await sleep(500);
        const screenshotUrl = await getFigmaScreenshotUrl(fileKey, task.id || task.refId);
        const visualDesc = await getVisualDescriptionFromGemini(screenshotUrl);

        const lowerName = componentName.toLowerCase();

        const currentPrompt = promptTemplate
            .replace('{{COMPONENT_NAME}}', componentName)
            .replace('{{CSS_FILE_NAME}}', lowerName)
            .replace('{{STRUCTURED_JSON}}', JSON.stringify(structuredJson, null, 2))
            .replace('{{CHILD_COMPONENT_MANIFEST}}', manifestString)
            .replace('{{CHILD_INTERFACES}}', interfaceString)
            .replace('{{GLOBAL_CSS}}', tokenData.cssContent)
            .replace('{{LAYOUT_RULES}}', layoutRulesContent);

        try {
            const generatedRaw = await generateCodeFromGemini(currentPrompt, visualDesc, screenshotUrl);
            const jsonMatch = generatedRaw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in response");

            const parsedCode = JSON.parse(jsonMatch[0]);

            await saveComponentToFile(componentName, parsedCode.tsx, parsedCode.css);

            if (parsedCode.propsDefinition) {
                PROPS_REGISTRY[componentName] = parsedCode.propsDefinition;
                console.log(`[REGISTRY] 📝 Harvested props for ${componentName}`);
            }

            builtResults.push(componentName);
            completedNames.add(componentName);

        } catch (err) {
            console.error(`[ERROR] Failed to build ${componentName}:`, err.message);
        }
    }

    console.log(`\n[ORCHESTRATOR] ✅ All tasks complete.`);
    return builtResults;
}

module.exports = { handleFigmaToCode };