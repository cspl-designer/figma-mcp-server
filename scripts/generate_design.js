require('dotenv').config();
const path = require('path');
const { loadComponentManifests } = require('../lib/knowledge.js');
const { getComponentsTool } = require('../tools/components.js');
const { codeGenTool } = require('../tools/codegen.js');
const { OUTPUT_PROJECT_DIRECTORY } = require('../config.js');

const FIGMA_URL = 'https://www.figma.com/design/g4RSfrZLzmicSFLB1luKBU/Untitled?node-id=204-33&t=ppstSk5qUezu00XT-4';

async function main() {
    try {
        console.log("🚀 Starting generation script...");
        console.log(`Target Project Directory: ${OUTPUT_PROJECT_DIRECTORY}`);

        // 1. Load Manifests
        console.log("Loading component manifests...");
        const componentManifests = await loadComponentManifests();
        console.log(`Loaded ${Object.keys(componentManifests).length} components.`);

        // 2. Initialize Tools
        const componentsToolInstance = getComponentsTool(componentManifests);
        const codeGenToolInstance = codeGenTool(componentManifests);

        // 3. Run get_components
        console.log("\n--- Running get_components ---");
        const componentsResult = await componentsToolInstance.handler({
            figmaUrl: FIGMA_URL,
            projectDirectory: OUTPUT_PROJECT_DIRECTORY
        });

        // Log output
        if (componentsResult.content) {
            componentsResult.content.forEach(c => console.log(c.text));
        }

        // 4. Run generate_code_from_figma
        console.log("\n--- Running generate_code_from_figma ---");
        const codeGenResult = await codeGenToolInstance.handler({
            figmaUrl: FIGMA_URL
        });

        // Log output
        if (codeGenResult.content) {
            codeGenResult.content.forEach(c => console.log(c.text));
        }

        console.log("\n✅ Generation complete.");

    } catch (error) {
        console.error("\n❌ Error during generation:", error);
        process.exit(1);
    }
}

main();
