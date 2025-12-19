const { z } = require('zod');
const fs = require('fs').promises;
const path = require('path');
const {
  getFigmaFileData,
  getFigmaNodeData,
  getFigmaScreenshotUrl,
  getVisualDescriptionFromGemini,
  generateCodeFromGemini,
} = require('../lib/api.js');
const { parseFigmaUrl } = require('../lib/utils.js');
const { generateGlobalCss } = require('../lib/css.js');
const { OUTPUT_PROJECT_DIRECTORY, KNOWLEDGE_BASE_DIR } = require('../config.js');

const layoutTemplatePath = path.join(KNOWLEDGE_BASE_DIR, 'layout_rules.md');

// ✅ REPLACED: Simple buildLayoutTree is now a detailed parser.
function buildStructuredLayoutTree(node) {
  if (!node || !node.absoluteBoundingBox) return null;

  const { name, type, absoluteBoundingBox, children, characters, fills, strokes, strokeWeight, cornerRadius, layoutMode, itemSpacing, paddingTop, paddingRight, paddingBottom, paddingLeft } = node;

  const parsedNode = {
    name,
    type,
    text: characters || null,
    position: {
      x: absoluteBoundingBox.x,
      y: absoluteBoundingBox.y,
      width: absoluteBoundingBox.width,
      height: absoluteBoundingBox.height,
    },
    layout: {
      flexDirection: layoutMode === 'VERTICAL' ? 'column' : 'row',
      gap: itemSpacing || 0,
      padding: {
        top: paddingTop || 0,
        right: paddingRight || 0,
        bottom: paddingBottom || 0,
        left: paddingLeft || 0,
      }
    },
    styles: {},
    children: [],
  };

  if (fills?.length > 0 && fills[0].type === 'SOLID') {
    parsedNode.styles.backgroundColor = fills[0].color;
  }
  if (strokes?.length > 0 && strokes[0].type === 'SOLID') {
    parsedNode.styles.border = `${strokeWeight}px solid ${strokes[0].color}`;
  }
  if (cornerRadius > 0) {
    parsedNode.styles.borderRadius = `${cornerRadius}px`;
  }

  if (children?.length > 0) {
    parsedNode.children = children.map(buildStructuredLayoutTree).filter(Boolean);
  }

  return parsedNode;
}


async function figmaToCodeOrchestrator(input, componentManifests) {
  const { figmaUrl } = input;
  const projectDirectory = OUTPUT_PROJECT_DIRECTORY;

  const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);

  console.error(`\n[AGENT] Starting intelligent page generation for: ${figmaUrl}`);

  // Fetch base Figma data
  const [figmaFileData, rootNode] = await Promise.all([
    getFigmaFileData(fileKey),
    getFigmaNodeData(fileKey, nodeId),
  ]);

  // ✅ UPDATED: Use the new parser to create a detailed JSON structure.
  const structuredLayoutJson = buildStructuredLayoutTree(rootNode);
  const componentName = rootNode.name.replace(/[\s-]+/g, '');

  // Get global CSS content
  const { css: globalCssContent } = generateGlobalCss(figmaFileData.styles, figmaFileData);

  // Load coding practice template
  const templatePath = path.join(
    KNOWLEDGE_BASE_DIR,
    'coding_practice.md'
  );
  const promptTemplate = await fs.readFile(templatePath, 'utf-8');
  const layoutRules = await fs.readFile(layoutTemplatePath, 'utf-8');

  // Prepare prompt text
  // ✅ UPDATED: Inject the new, more detailed JSON into the existing prompt.
  const finalPrompt = promptTemplate
    .replace('{{COMPONENT_LIST}}', `- ${Object.keys(componentManifests).join('\n- ')}`)
    .replace('{{LAYOUT_JSON}}', JSON.stringify(structuredLayoutJson, null, 2))
    .replace('{{GLOBAL_CSS}}', globalCssContent)
    .replace(new RegExp('{{COMPONENT_NAME}}', 'g'), componentName)
    .concat(`\n\n${layoutRules}`);

  // --- NEW: Screenshot + Visual Description ---
  const screenshotUrl = await getFigmaScreenshotUrl(fileKey, nodeId);
  const visualDescription = await getVisualDescriptionFromGemini(screenshotUrl);

  // Generate code using prompt + visual description + screenshot reference
  const generatedOutput = await generateCodeFromGemini(
    finalPrompt,
    visualDescription,
    screenshotUrl
  );
  console.log('[DEBUG] Figma Node Response:', finalPrompt);

  // --- PARSE AND SAVE THE TWO GENERATED FILES ---
  const cssMatch = generatedOutput.match(/--- CSS_MODULE_START ---\s*([\s\S]*)/);
  const tsxMatch = generatedOutput.match(/--- TSX_FILE_START ---\s*([\s\S]*)/);

  if (!tsxMatch || !cssMatch) {
    throw new Error("AI did not generate the code in the expected two-part format.");
  }

  const cssModuleContent = cssMatch[1].replace(/--- TSX_FILE_START ---[\s\S]*/, '').trim();
  const tsxCode = tsxMatch[1].replace(/--- TSX_FILE_START ---[\s\S]*/, '').trim();

  const pagesDir = path.join(projectDirectory, 'src', 'pages');
  await fs.mkdir(pagesDir, { recursive: true });

  // Save the CSS Module file
  const cssFilePath = path.join(pagesDir, `${componentName}.module.css`);
  await fs.writeFile(cssFilePath, cssModuleContent);
  console.log(`[AGENT] ✅ Page CSS module saved to: ${cssFilePath}`);

  // Save the TSX Component file
  const tsxFilePath = path.join(pagesDir, `${componentName}.tsx`);
  await fs.writeFile(tsxFilePath, tsxCode);
  console.log(`[AGENT] ✅ Page component saved to: ${tsxFilePath}`);


  // --- AUTO-WIRE APP.TSX ---
  try {
    const appTsxPath = path.join(projectDirectory, 'src', 'App.tsx');
    let appTsxContent = await fs.readFile(appTsxPath, 'utf-8');

    // 1. Calculate Component Name and Route Path
    // componentName might be lowercase (e.g. newloginpage)
    // We need PascalCase for the React component (e.g. Newloginpage)
    const pascalComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

    // Convert to kebab-case for URL (e.g. /new-login-page)
    const routePath = '/' + componentName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    // 2. Check if already imported
    // Use PascalCase for the import name to ensure it works as a JSX tag
    const importStatement = `import ${pascalComponentName} from './pages/${componentName}';`;
    if (!appTsxContent.includes(importStatement)) {
      // Inject import after the last import statement or at the top
      const lastImportIndex = appTsxContent.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = appTsxContent.indexOf('\n', lastImportIndex);
        appTsxContent =
          appTsxContent.slice(0, endOfLastImport + 1) +
          importStatement + '\n' +
          appTsxContent.slice(endOfLastImport + 1);
      } else {
        appTsxContent = importStatement + '\n' + appTsxContent;
      }
      console.log(`[AGENT] ✅ Added import for ${componentName} to App.tsx`);
    }

    // 3. Check if route already exists
    const routeElement = `<Route path="${routePath}" element={<${pascalComponentName} />} />`;
    if (!appTsxContent.includes(routeElement)) {
      // Inject route inside <Routes>
      // Look for the closing </Routes> tag and insert before it
      const routesCloseIndex = appTsxContent.indexOf('</Routes>');
      if (routesCloseIndex !== -1) {
        appTsxContent =
          appTsxContent.slice(0, routesCloseIndex) +
          `  ${routeElement}\n        ` +
          appTsxContent.slice(routesCloseIndex);
        console.log(`[AGENT] ✅ Added route "${routePath}" to App.tsx`);
      } else {
        console.warn('[AGENT] ⚠️ Could not find <Routes> tag in App.tsx. Skipping route injection.');
      }
    } else {
      console.log(`[AGENT] ℹ️ Route "${routePath}" already exists in App.tsx`);
    }

    await fs.writeFile(appTsxPath, appTsxContent);

    // 4. Log the URL
    console.log(`\n🎉 Page generated successfully!`);
    console.log(`👉 Preview at: http://localhost:5173${routePath}\n`);

  } catch (error) {
    console.error(`[AGENT] ⚠️ Failed to auto-wire App.tsx: ${error.message}`);
  }

  return {
    content: [
      {
        type: "text",
        text: `Successfully generated and saved:\n- \`${tsxFilePath}\`\n- \`${cssFilePath}\`\n\nPreview at: http://localhost:5173/`,
      },
    ],
  };
}

const codeGenTool = (componentManifests) => ({
  name: 'generate_code_from_figma',
  definition: {
    title: 'Generate Functional Page From Figma',
    description:
      'Converts a Figma design into a functional React page component with state and handlers.',
    inputSchema: {
      figmaUrl: z.string().url().describe("The full URL of the Figma frame to generate."),
    },
  },
  handler: (input) => figmaToCodeOrchestrator(input, componentManifests),
});

module.exports = { codeGenTool };