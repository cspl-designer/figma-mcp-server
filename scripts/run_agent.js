// scripts/run_agent.js
const { handleFigmaToCode } = require('../lib/api');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// Replace with your actual Figma File Key and Node ID
const FILE_KEY = 'g4RSfrZLzmicSFLB1luKBU';
const NODE_ID = '421-2620';

// FIX: Point to the file in the root directory (../)
const PROMPT_PATH = path.join(__dirname, '../design_system_knowledge_base/unified_component_prompt.md');

(async () => {
    try {
        console.log("🚀 Starting Agent...");
        console.log(`[CONFIG] File: ${FILE_KEY}`);
        console.log(`[CONFIG] Start Node: ${NODE_ID}`);

        // 1. Read the System Prompt
        if (!fs.existsSync(PROMPT_PATH)) {
            throw new Error(`Prompt file not found at: ${PROMPT_PATH}`);
        }
        const promptTemplate = fs.readFileSync(PROMPT_PATH, 'utf-8');

        // 2. Start the Recursive Build Process
        const builtComponents = await handleFigmaToCode(FILE_KEY, NODE_ID, promptTemplate);

        console.log("\n✅ SUCCESS! The following components were generated:");
        console.log(builtComponents);

    } catch (error) {
        console.error("\n❌ FATAL ERROR:", error);
        process.exit(1);
    }

})();