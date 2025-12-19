/**
 * lib/utils.js
 * Contains generic helper functions used across the application.
 */

/**
 * Retries an async function with exponential backoff.
 */

 

function retryWithBackoff(fn, retries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return fn();
      } catch (error) {
        lastError = error;
        console.warn(
          `[RETRY] Attempt ${
            i + 1
          } of ${retries} failed. Retrying in ${delay / 1000}s...`
        );
        new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      }
    }
    throw lastError;
  }
  
/**
 * Parses a Figma URL to extract the file key and node ID.
 */
function parseFigmaUrl(url) {
    const match = url.match(/figma\.com\/(file|design)\/([^\/]+)\/.*?node-id=([^&]+)/);
    if (!match) return null;
    const nodeId = decodeURIComponent(match[3]).replace('-', ':');
    return { fileKey: match[2], nodeId };
}

/**
 * --- NEW FUNCTION ---
 * Converts a Figma Style name (e.g., "Brand/background/$primary")
 * into a valid CSS variable name (e.g., "var(--brand-background-primary)").
 */
function figmaStyleNameToCssVar(styleName) {
    const sanitized = styleName
        .toLowerCase()
        .replace(/[\/\s\$]/g, '-') // Replaces slashes, spaces, and dollar signs
        .replace(/^-+|-+$/g, '');   // Removes any leading/trailing hyphens
    return `var(--${sanitized})`;
}
  

module.exports = {
    retryWithBackoff,
    parseFigmaUrl, 
    figmaStyleNameToCssVar, // Export the new function
};