const fs = require('fs/promises');
const path = require('path');
const { KNOWLEDGE_BASE_DIR } = require('../config.js');

let componentManifests = {};

async function loadComponentManifests() {
  const componentsDir = path.join(KNOWLEDGE_BASE_DIR, 'components');
  try {
    const componentFolders = await fs.readdir(componentsDir, { withFileTypes: true });

    for (const folder of componentFolders) {
      if (folder.isDirectory()) {
        const componentPath = path.join(componentsDir, folder.name);
        const filesInFolder = await fs.readdir(componentPath);
        const manifestFile = filesInFolder.find(file => file.endsWith('.manifest.json'));

        if (manifestFile) {
          const filePath = path.join(componentPath, manifestFile);
          const content = await fs.readFile(filePath, 'utf-8');
          const manifest = JSON.parse(content);
          manifest.componentSubfolder = folder.name;
          componentManifests[manifest.componentName] = manifest;
        }
      }
    }
    return componentManifests;
  } catch (error) {
    console.error(`[FATAL] Could not load component manifests from ${componentsDir}. Make sure the folder and files exist.`, error);
    process.exit(1);
  }
}

async function getComponentDocs(componentNames) {
  let allDocs = '--- COMPONENT DOCUMENTATION ---\n\n';
  for (const name of componentNames) {
    const manifest = componentManifests[name];
    if (!manifest || !manifest.docFile || !manifest.componentSubfolder) continue;

    const docPath = path.join(
      KNOWLEDGE_BASE_DIR,
      'components',
      manifest.componentSubfolder,
      manifest.docFile
    );

    try {
      const content = await fs.readFile(docPath, 'utf-8');
      allDocs += `## Documentation for ${name}\n\n${content}\n\n---\n\n`;
    } catch (error) {
      // Keep this silent
    }
  }
  allDocs += '--- END DOCUMENTATION ---';
  return allDocs;
}

module.exports = {
  loadComponentManifests,
  getComponentDocs,
};