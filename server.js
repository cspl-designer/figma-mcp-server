require('dotenv').config();

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { loadComponentManifests } = require('./lib/knowledge.js');
const { registerTools } = require('./tools/index.js');

async function main() {
  try {
    console.error('Initializing Figma Codegen MCP Server (Stdio Mode)...');

    if (!process.env.FIGMA_TOKEN || !process.env.GEMINI_API_KEY) {
      console.error('[FATAL] FIGMA_TOKEN or GEMINI_API_KEY is missing. Check your .env file.');
      process.exit(1);
    }
    
    const componentManifests = await loadComponentManifests();
    
    const server = new McpServer({
      name: 'figma-codegen-agent',
      version: '1.0.0',
    });

    registerTools(server, componentManifests);

    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('✅ Figma Codegen MCP Server is running and connected via Stdio.');

  } catch (error) {
    console.error('[FATAL] Server failed to start:', error);
    process.exit(1);
  }
}

main();