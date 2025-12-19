const { z } = require('zod');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const fs = require('fs').promises; // <-- THIS LINE WAS MISSING

const execPromise = util.promisify(exec);

// In tools/project.js

// In tools/project.js

async function createReactProjectHandler(input) {
    const { projectName, directory } = input;
    console.error(`[AGENT] Received request to create project '${projectName}' in directory '${directory}'`);

    if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
        return { content: [{ type: 'text', text: `Error: Invalid project name.` }] };
    }
    
    const targetDir = path.resolve(directory);
    const projectPath = path.join(targetDir, projectName);

    try {
        console.error(`[AGENT] Step 1: Creating Vite project...`);
        const createCommand = `npm create vite@latest ${projectName} -- --template react-ts`;
        await execPromise(createCommand, { cwd: targetDir });
        console.error(`[AGENT] Vite project created at ${projectPath}`);

        console.error(`[AGENT] Step 2: Installing React Router...`);
        await execPromise('npm install react-router-dom', { cwd: projectPath });

        console.error(`[AGENT] Step 3: Installing Tailwind CSS...`);
        await execPromise('npm install -D tailwindcss postcss autoprefixer', { cwd: projectPath });
        
        // --- STEP 4 REMOVED ---
        // We are skipping the problematic tailwindcss init command.
        
        console.error(`[AGENT] Project setup complete.`);

        // Updated success message with the manual next step.
        const successMessage = `✅ Successfully created the React project '${projectName}'!

**Final Manual Step:**
To finish the Tailwind CSS setup, please run the following commands inside the new project folder:

1. \`cd ${projectPath}\`
2. \`npx tailwindcss init -p\`

After that, you can configure \`tailwind.config.js\` and add the Tailwind directives to \`src/index.css\`.`;

        return { content: [{ type: 'text', text: successMessage }] };

    } catch (error) {
        console.error(`[AGENT] An error occurred during project setup:`, error);
        const fullErrorLog = `An error occurred. See the log below:\n\n**STDOUT:**\n\`\`\`\n${error.stdout}\n\`\`\`\n\n**STDERR:**\n\`\`\`\n${error.stderr}\n\`\`\``;
        return { content: [{ type: 'text', text: fullErrorLog }] };
    }
}

const createReactProjectTool = (componentManifests) => ({
    name: 'create_react_project',
    definition: {
        title: 'Create React Project',
        description: 'Creates a new React (Vite + TypeScript) project boilerplate with Tailwind CSS and React Router installed.',
        inputSchema: {
            projectName: z.string().describe("The name for the new project folder (e.g., 'my-new-app')."),
            directory: z.string().describe("The absolute path to the directory where the project should be created (e.g., '/Users/me/Projects')."),
        },
    },
    handler: (input) => createReactProjectHandler(input, componentManifests),
});

module.exports = {
  createReactProjectTool,
};