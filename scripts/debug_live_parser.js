// scripts/debug_live_parser.js
const { getFigmaNodeData } = require('../lib/api');
const { parseFigmaNode } = require('../lib/parser');

// --- CONFIGURATION ---
// Replace with your actual File Key (found in your Figma URL)
const FILE_KEY = 'g4RSfrZLzmicSFLB1luKBU';

// This is the Node ID for "Calandar - Data range" from your previous logs
const NODE_ID = '376:2421';

(async () => {
    try {
        console.log(`[DEBUG] Fetching Live Node Data for ${NODE_ID}...`);

        // 1. Fetch real data from Figma API
        const liveNode = await getFigmaNodeData(FILE_KEY, NODE_ID);

        // 2. Parse it using your current logic
        const parsedJson = parseFigmaNode(liveNode);

        // 3. Log the "Children" specifically to see what they are detected as
        console.log("\n--- PARSED STRUCTURE (Top Level Children) ---");

        if (parsedJson.children) {
            parsedJson.children.forEach((child, index) => {
                console.log(`\n[Child ${index}]: ${child.name}`);
                console.log(`  Type Detected: ${child.type}`); // Should be COMPONENT_INSTANCE
                console.log(`  Real Element:  ${child.elementType}`);

                // Dig one level deeper if it's a container (like "Content Area")
                if (child.children && child.children.length > 0) {
                    console.log(`  > Grandchildren:`);
                    child.children.forEach(grandchild => {
                        console.log(`    - ${grandchild.name} (${grandchild.type})`);
                    });
                }
            });
        }

        console.log("\n--- FULL JSON OUTPUT ---");
        // console.log(JSON.stringify(parsedJson, null, 2)); // Uncomment to see everything

    } catch (error) {
        console.error("DEBUG ERROR:", error);
    }
})();