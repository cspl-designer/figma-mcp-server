// lib/token_map.js
const fetch = require('node-fetch');
const { FIGMA_TOKEN } = require('../config.js');

// --- HELPER: Normalize names to CSS variables ---
function formatVarName(name) {
    return '--' + name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphens
        .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}

// --- HELPER: Convert RGBA to Hex/RGBA String ---
function rgbaToHex(color, opacity) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    return opacity !== undefined && opacity < 1
        ? `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity.toFixed(2)})`
        : hex;
}

// --- MAIN FUNCTION ---
async function buildTokenMap(fileKey) {
    console.log('[TOKENS] 🎨 Building Token Map from Figma Styles...');

    const url = `https://api.figma.com/v1/files/${fileKey}`;
    const response = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });

    if (!response.ok) throw new Error(`Figma API Error: ${response.statusText}`);
    const data = await response.json();

    const tokenMap = new Map(); // Key: StyleID, Value: { varName, value, type }
    const cssLines = [
        `/* 🎨 GLOBAL DESIGN TOKENS - Generated: ${new Date().toISOString()} */`,
        ':root {'
    ];

    // 1. Process Metadata (Create Variable Names)
    const stylesToFetch = Object.entries(data.styles).map(([id, meta]) => {
        const varName = formatVarName(meta.name);
        tokenMap.set(id, { varName, type: meta.styleType, name: meta.name, value: null });
        return id;
    });

    // 2. Scan Document for Values
    const idsToFind = new Set(stylesToFetch);

    function scanValues(node) {
        if (idsToFind.size === 0) return;

        if (node.styles) {
            // A. Check Fill Styles (Colors)
            if (node.styles.fill && idsToFind.has(node.styles.fill)) {
                const styleId = node.styles.fill;
                if (node.fills && node.fills[0] && node.fills[0].type === 'SOLID') {
                    const fill = node.fills[0];
                    const hex = rgbaToHex(fill.color, fill.opacity);

                    const token = tokenMap.get(styleId);
                    if (!token.value) {
                        token.value = hex;
                        idsToFind.delete(styleId);
                    }
                }
            }

            // B. Check Stroke Styles (Colors)
            if (node.styles.stroke && idsToFind.has(node.styles.stroke)) {
                const styleId = node.styles.stroke;
                if (node.strokes && node.strokes[0] && node.strokes[0].type === 'SOLID') {
                    const stroke = node.strokes[0];
                    const hex = rgbaToHex(stroke.color, stroke.opacity);

                    const token = tokenMap.get(styleId);
                    if (!token.value) {
                        token.value = hex;
                        idsToFind.delete(styleId);
                    }
                }
            }

            // C. Check Text Styles (Typography)
            if (node.styles.text && idsToFind.has(node.styles.text)) {
                const styleId = node.styles.text;
                if (node.style) {
                    const fontValue = {
                        fontSize: `${node.style.fontSize}px`,
                        fontWeight: node.style.fontWeight,
                        lineHeight: node.style.lineHeightPx ? `${Math.round(node.style.lineHeightPx)}px` : '1.5',
                        letterSpacing: node.style.letterSpacing ? `${Math.round(node.style.letterSpacing)}px` : '0px',
                        fontFamily: `"${node.style.fontFamily}", sans-serif`
                    };

                    const token = tokenMap.get(styleId);
                    if (!token.value) {
                        token.value = fontValue;
                        idsToFind.delete(styleId);
                    }
                }
            }
        }

        // Recurse
        if (node.children) node.children.forEach(scanValues);
    }

    scanValues(data.document);

    // 3. Build CSS Content

    // --- COLORS ---
    cssLines.push('  /* --- COLORS --- */');
    tokenMap.forEach((token) => {
        if (token.type === 'FILL' && token.value) {
            cssLines.push(`  ${token.varName}: ${token.value};`);
        }
    });

    // --- TYPOGRAPHY ---
    cssLines.push('\n  /* --- TYPOGRAPHY --- */');
    tokenMap.forEach((token) => {
        if (token.type === 'TEXT' && token.value) {
            // We generate a set of variables for each text style
            cssLines.push(`  /* ${token.name} */`);
            cssLines.push(`  ${token.varName}-font-size: ${token.value.fontSize};`);
            cssLines.push(`  ${token.varName}-font-weight: ${token.value.fontWeight};`);
            cssLines.push(`  ${token.varName}-line-height: ${token.value.lineHeight};`);
            // Optional: Letter spacing
            if (token.value.letterSpacing !== '0px') {
                cssLines.push(`  ${token.varName}-letter-spacing: ${token.value.letterSpacing};`);
            }
        }
    });

    // --- SPACING (Standard Scale) ---
    cssLines.push(`
  /* --- SPACING --- */
  --spacing-0: 0px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* --- RADIUS --- */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
`);

    cssLines.push('}');

    console.log(`[TOKENS] ✅ Mapped ${tokenMap.size} styles to CSS variables.`);

    return {
        // ✅ UPDATED LOOKUP: Returns an object, not a string
        lookup: (styleId) => {
            const token = tokenMap.get(styleId);
            if (!token) return null;
            return {
                name: token.varName, // e.g., "--bodytext-regular"
                type: token.type,    // "TEXT" or "FILL"
                value: token.value   // raw value for fallbacks
            };
        },
        cssContent: cssLines.join('\n')
    };
}

module.exports = { buildTokenMap };