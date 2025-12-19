// listModels.js
require('dotenv').config();
const fetch = require('node-fetch');

async function listModels() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error("❌ Missing GEMINI_API_KEY in .env");

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`❌ Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  console.log("✅ Available Gemini Models:");
  data.models.forEach(m => console.log(`- ${m.name}`));
}

listModels().catch(console.error);
