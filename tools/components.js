const { z } = require('zod');
const fs = require('fs').promises;
const path = require('path');
const { getFigmaFileData, getFigmaNodeData, generateCodeFromGemini } = require('../lib/api.js');
const { findAndExtractComponentsRecursively } = require('../lib/figma.js');
const { parseFigmaUrl } = require('../lib/utils.js');
const { generateGlobalCss } = require('../lib/css.js');
const { getComponentDocs } = require('../lib/knowledge.js');
const { KNOWLEDGE_BASE_DIR } = require('../config.js');

//const cssTemplatePath = path.join(KNOWLEDGE_BASE_DIR, 'component_css.md');
//const tsxTemplatePath = path.join(KNOWLEDGE_BASE_DIR, 'component_tsx.md');
const layoutTemplatePath = path.join(KNOWLEDGE_BASE_DIR, 'layout_rules.md');

async function loadTemplate(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`[AGENT] Error loading template: ${filePath}`, error);
    throw new Error(`Could not load template file: ${path.basename(filePath)}`);
  }
}

// In tools/components.js

// In tools/components.js

async function getComponentsHandler(input, componentManifests) {
  const { figmaUrl, projectDirectory } = input;
  if (!figmaUrl || !projectDirectory) {
    return { content: [{ type: "text", text: "Error: `figmaUrl` and `projectDirectory` are required." }] };
  }

  try {
    const figmaIds = parseFigmaUrl(figmaUrl);
    const [figmaFileData, figmaNodeData] = await Promise.all([
      getFigmaFileData(figmaIds.fileKey),
      getFigmaNodeData(figmaIds.fileKey, figmaIds.nodeId),
    ]);

    const { css: globalCssContent, spacingMap } = generateGlobalCss(figmaFileData.styles, figmaFileData);

    const globalCssPath = path.join(projectDirectory, 'src', 'global.css');
    await fs.mkdir(path.dirname(globalCssPath), { recursive: true });
    await fs.writeFile(globalCssPath, globalCssContent);

    const foundComponents = [];
    findAndExtractComponentsRecursively(figmaNodeData, componentManifests, figmaFileData.styles, foundComponents, spacingMap);

    const uniqueComponents = new Map();
    for (const comp of foundComponents) {
      if (!uniqueComponents.has(comp.componentName)) {
        uniqueComponents.set(comp.componentName, comp);
      }
    }

    if (uniqueComponents.size === 0) {
      return { content: [{ type: "text", text: "No known components were identified in the Figma design." }] };
    }

    const createdFiles = [`- \`${globalCssPath}\``];

    const unifiedTemplatePath = path.join(KNOWLEDGE_BASE_DIR, 'unified_component_prompt.md');
    const unifiedTemplate = await loadTemplate(unifiedTemplatePath);
    const layoutRules = await loadTemplate(layoutTemplatePath);

    for (const component of uniqueComponents.values()) {
      const { componentName, structuredJson } = component;
      const manifest = componentManifests[componentName];
      if (!manifest) continue;

      const componentDir = path.join(projectDirectory, 'src', 'components', componentName);

      // ✅ NEW: Check if the component directory already exists
      try {
        await fs.stat(componentDir); // This will throw an error if the directory doesn't exist
        console.log(`[AGENT] ✅ Skipping '${componentName}': Component already exists.`);
        continue; // Skip to the next component in the loop
      } catch (error) {
        if (error.code !== 'ENOENT') {
          // If it's an error other than "Not Found", something is wrong.
          throw error;
        }
        // If the error is 'ENOENT', the directory doesn't exist, so we proceed with generation.
        console.log(`[AGENT] ⏳ Component '${componentName}' not found. Generating...`);
      }

      // This code will only run if the component does NOT exist
      await fs.mkdir(componentDir, { recursive: true });

      const componentDocs = await getComponentDocs([componentName]);
      const finalPrompt = unifiedTemplate
        .replace(/{{COMPONENT_NAME}}/g, componentName)
        .replace('{{MANIFEST}}', JSON.stringify(manifest, null, 2))
        .replace('{{COMPONENT_DOCS}}', componentDocs)
        .replace('{{STRUCTURED_JSON}}', JSON.stringify(structuredJson, null, 2))
        .replace('{{GLOBAL_CSS}}', globalCssContent)
        .replace('{{LAYOUT_RULES}}', layoutRules);

      console.log(`[AGENT] Generating TSX and CSS for ${componentName}...`);
      const rawOutput = await generateCodeFromGemini(finalPrompt);

      let generatedCode;
      try {
        const startIndex = rawOutput.indexOf('{');
        const endIndex = rawOutput.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) {
          throw new Error("No valid JSON object found in the AI response.");
        }
        const jsonString = rawOutput.substring(startIndex, endIndex + 1);
        generatedCode = JSON.parse(jsonString);
      } catch (e) {
        console.error("[AGENT] Failed to parse JSON from AI response. Raw output:", rawOutput);
        throw new Error("The AI returned a malformed JSON response.");
      }

      if (!generatedCode.tsx || !generatedCode.css) {
        console.error(`[AGENT] AI output for ${componentName} is missing 'tsx' or 'css' keys. Skipping.`);
        continue;
      }

      const tsxPath = path.join(componentDir, `${componentName}.tsx`);
      await fs.writeFile(tsxPath, generatedCode.tsx);
      createdFiles.push(`- \`${tsxPath}\``);

      const cssPath = path.join(componentDir, `${componentName}.module.css`);
      await fs.writeFile(cssPath, generatedCode.css);
      createdFiles.push(`- \`${cssPath}\``);
    }

    const successMessage = `Successfully generated files:\n\n${createdFiles.join('\n')}`;
    return { content: [{ type: "text", text: successMessage }] };

  } catch (error) {
    console.error(`[AGENT] Error in get_components:`, error);
    return { content: [{ type: "text", text: `An error occurred: ${error.message}` }] };
  }
}

const getComponentsTool = (componentManifests) => ({
  name: 'get_components',
  definition: {
    title: 'getComponents',
    description: 'Identifies known components and generates their AI-powered .tsx and .module.css files, plus a global stylesheet.',
    inputSchema: {
      figmaUrl: z.string().url().describe("The full URL of the Figma frame to scan."),
      projectDirectory: z.string().describe("The absolute path to the React project."),
    },
  },
  handler: (input) => getComponentsHandler(input, componentManifests),
});

module.exports = { getComponentsTool };