// scripts/debug_extraction.js
const fetch = require('node-fetch');
const { FIGMA_TOKEN } = require('../config.js');

// --- CONFIGURATION ---
const FILE_KEY = 'g4RSfrZLzmicSFLB1luKBU'; // Your File Key

// ⚠️ REPLACE THIS with the ID of the "Actions" variant of Table-cell.
// From your previous logs, one of these is likely the "Actions" one:
// '376:2421', '376:2415', or '376:2423'
const TARGET_NODE_ID = '376:2541';

// --- HELPERS ---

async function getFigmaNode(nodeId) {
    console.log(`[DEBUG] Fetching raw data for Node ID: ${nodeId}...`);
    const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${nodeId}`;

    try {
        const response = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
        const data = await response.json();
        const key = nodeId.replace('-', ':');
        return data.nodes[key]?.document;
    } catch (error) {
        console.error(`[ERROR] Failed to fetch: ${error.message}`);
        return null;
    }
}

function printHierarchy(node, depth = 0) {
    if (!node) return;

    // Visual indentation
    const indent = '  '.repeat(depth);
    const icon = node.type === 'INSTANCE' ? '💠' :
        node.type === 'COMPONENT' ? '❖' :
            node.type === 'TEXT' ? 'T' : '⬜';

    // Print current node details
    console.log(`${indent}${icon} [${node.type}] Name: "${node.name}" (ID: ${node.id})`);

    // Highlight if this is the missing instance
    if (node.name.toLowerCase().includes('icon')) {
        console.log(`${indent}   🔥🔥🔥 FOUND IT! This is likely the missing instance.`);
        console.log(`${indent}   Details: ComponentID=${node.componentId}`);
    }

    // Recurse
    if (node.children) {
        node.children.forEach(child => printHierarchy(child, depth + 1));
    }
}

// --- MAIN EXECUTION ---

(async () => {
    console.log("🔍 STARTING DEEP SCAN...\n");

    const rootNode = await getFigmaNode(TARGET_NODE_ID);

    if (!rootNode) {
        console.error("❌ Could not retrieve node data.");
        return;
    }

    console.log("--- NODE HIERARCHY ---");
    printHierarchy(rootNode);
    console.log("----------------------");

})();