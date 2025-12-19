const { codeGenTool } = require('./codegen.js');
const { getComponentsTool } = require('./components.js');
const { createReactProjectTool } = require('./project.js'); // <-- 1. Import the new tool


function registerTools(server, componentManifests) {
  try {
    // This will now work correctly for both tools
    const componentsTool = getComponentsTool(componentManifests);
    server.registerTool(
        componentsTool.name, 
        componentsTool.definition, 
        componentsTool.handler
    );

    const figmaTool = codeGenTool(componentManifests);
    server.registerTool(
        figmaTool.name, 
        figmaTool.definition, 
        figmaTool.handler
    );
    
    const projectTool = createReactProjectTool(componentManifests);
    server.registerTool(
        projectTool.name,
        projectTool.definition,
        projectTool.handler
    );

    console.log("All tools registered successfully.");
  } catch (error) {
    console.error(`[FATAL] Error registering tools:`, error);
    process.exit(1);
  }
}

module.exports = {
  registerTools,
};