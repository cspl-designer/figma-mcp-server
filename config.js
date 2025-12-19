require('dotenv').config();
const path = require('path');

if (!process.env.FIGMA_TOKEN || !process.env.GEMINI_API_KEY) {
  throw new Error("Missing required environment variables: FIGMA_TOKEN or GEMINI_API_KEY");
}

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use supported models instead of "-latest"
const GEMINI_TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_VISION_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// Define Project Paths relative to the root (assuming this file is at root)
const ROOT_DIR = __dirname;
const KNOWLEDGE_BASE_DIR = path.join(ROOT_DIR, 'design_system_knowledge_base');
const OUTPUT_PROJECT_DIRECTORY = path.join(ROOT_DIR, 'my-react-app');

module.exports = {
  FIGMA_TOKEN,
  GEMINI_API_KEY,
  GEMINI_TEXT_API_URL,
  GEMINI_VISION_API_URL,
  KNOWLEDGE_BASE_DIR,
  OUTPUT_PROJECT_DIRECTORY,
};
