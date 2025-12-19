const fetch = require('node-fetch');
// Ensure we are importing all required variables from the single source of truth
const { FIGMA_TOKEN, GEMINI_VISION_API_URL, GEMINI_TEXT_API_URL } = require('../config.js');

async function getFigmaFileData(fileKey) {
  console.error('[API] Fetching Figma file data...');
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  const response = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!response.ok) throw new Error(`Figma API error (file): ${response.statusText}`);
  console.error('[API] ✅ Figma file data retrieved.');
  return await response.json();
}

async function getFigmaNodeData(fileKey, nodeId) {
  console.error('[API] Fetching Figma node data...');
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
  const response = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!response.ok) throw new Error(`Figma API error (nodes): ${response.statusText}`);
  const data = await response.json();
  const nodeKey = nodeId.replace('-', ':');
  const node = data.nodes[nodeKey];
  if (!node) throw new Error(`Figma API did not return data for node-id "${nodeId}".`);
  console.error('[API] ✅ Figma node data retrieved.');
  return node.document;
}

async function getFigmaScreenshotUrl(fileKey, nodeId) {
  console.error('[API] Fetching Figma screenshot URL...');
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&scale=2`;
  const response = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!response.ok) throw new Error(`Figma API error (images): ${response.statusText}`);
  const data = await response.json();
  if (data.err || !data.images || !data.images[nodeId]) throw new Error('Figma API did not return a valid screenshot URL.');
  console.error('[API] ✅ Figma screenshot URL retrieved.');
  return data.images[nodeId];
}

async function getVisualDescriptionFromGemini(imageUrl) {
  console.error('[API] Getting visual description from Gemini...');
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error(`Failed to fetch image from S3: ${imageResponse.statusText}`);
  const imageBuffer = await imageResponse.buffer();
  const base64ImageData = imageBuffer.toString('base64');
  const payload = {
    contents: [{
      parts: [
        { text: "Analyze this UI screenshot and provide a structured description of its components, layout, and purpose." },
        { inlineData: { mimeType: "image/png", data: base64ImageData } }
      ]
    }]
  };
  const response = await fetch(GEMINI_VISION_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Gemini Vision API error: ${response.statusText}`);
  const result = await response.json();
  if (!result.candidates || result.candidates.length === 0) throw new Error("Gemini Vision API returned no content.");
  console.error('[API] ✅ Visual description retrieved.');
  return result.candidates[0].content.parts[0].text;
}

async function generateCodeFromGemini(prompt, visualDescription, screenshotUrl) {
  console.error('[API] Generating code from Gemini...');
  console.error(`[DEBUG] Using Gemini Text API URL: ${GEMINI_TEXT_API_URL}`);

  const fullPrompt = `${prompt}\n\n--- VISUAL CONTEXT ---\nVisual Description: ${visualDescription}\nScreenshot URL: ${screenshotUrl}`;
  const payload = {
    contents: [{ parts: [{ text: fullPrompt }] }],
    generationConfig: { temperature: 0.1 },
  };

  const response = await fetch(GEMINI_TEXT_API_URL, { // This now reliably uses the imported variable
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[API ERROR] Gemini API response body:', errorBody);
    throw new Error(`Gemini Code Gen API error: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.candidates || result.candidates.length === 0) {
    throw new Error("Gemini API returned no candidates for code generation.");
  }
  
  console.error('[API] ✅ Code generated successfully.');
  const code = result.candidates[0].content.parts[0].text;
  return code.replace(/```(tsx|jsx|typescript|javascript|css)?/g, '').trim();
}

module.exports = {
  getFigmaFileData,
  getFigmaNodeData,
  getFigmaScreenshotUrl,
  getVisualDescriptionFromGemini,
  generateCodeFromGemini,
};