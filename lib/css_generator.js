// lib/css_generator.js

const toKebabCase = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// Global Style Cache
const STYLE_CACHE = new Map();

function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
}

function generateCSSRules(visualSpec) {
    if (!visualSpec) return [];
    const rules = [];
    const box = visualSpec.box || {};

    // ✅ FIX 1: GLOBAL RESET
    // Always apply border-box to ensure width includes padding (matches Figma)
    rules.push('box-sizing: border-box;');

    // --- GRID LAYOUT ---
    if (box.display === 'grid') {
        if (box.gridTemplateColumns) rules.push(`grid-template-columns: ${box.gridTemplateColumns};`);
        if (box.justifyItems) rules.push(`justify-items: ${box.justifyItems};`);
        if (box.alignItems) rules.push(`align-items: ${box.alignItems};`);
    }

    // --- SKIPPED PROPS ---
    const skippedProps = new Set([
        'borderWidth', 'borderColor', 'borderStyle',
        'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth',
        'gridTemplateColumns', 'justifyItems', 'flexWrap', 'flexShrink'
    ]);

    // --- A. PROCESS GENERAL LAYOUT ---
    Object.entries(box).forEach(([prop, value]) => {
        if (!skippedProps.has(prop) && value && value !== 'undefined' && prop !== 'constraints') {
            if (box.display === 'grid' && (prop === 'flexDirection' || prop === 'justifyContent')) return;
            const kebabProp = toKebabCase(prop);
            rules.push(`${kebabProp}: ${value};`);
        }
    });

    // ✅ FIX 2: Explicit Flex Props
    if (box.flexWrap) rules.push(`flex-wrap: ${box.flexWrap};`);
    if (box.flexShrink !== undefined) rules.push(`flex-shrink: ${box.flexShrink};`);

    // --- B. PROCESS BORDERS ---
    const color = box.borderColor;
    if (color) {
        if (box.borderWidth && box.borderWidth !== '0px') rules.push(`border: ${box.borderWidth} solid ${color};`);
        if (box.borderTopWidth && box.borderTopWidth !== '0px') rules.push(`border-top: ${box.borderTopWidth} solid ${color};`);
        if (box.borderBottomWidth && box.borderBottomWidth !== '0px') rules.push(`border-bottom: ${box.borderBottomWidth} solid ${color};`);
        if (box.borderLeftWidth && box.borderLeftWidth !== '0px') rules.push(`border-left: ${box.borderLeftWidth} solid ${color};`);
        if (box.borderRightWidth && box.borderRightWidth !== '0px') rules.push(`border-right: ${box.borderRightWidth} solid ${color};`);
    }

    // --- 2. TYPOGRAPHY ---
    if (visualSpec.typography) {
        Object.entries(visualSpec.typography).forEach(([prop, value]) => {
            if (prop !== 'raw' && value) {
                let cleanValue = value;
                if (prop === 'fontFamily' && !cleanValue.includes('"') && !cleanValue.includes("'")) {
                    cleanValue = `"${cleanValue}"`;
                }
                rules.push(`${toKebabCase(prop)}: ${cleanValue};`);
            }
        });
    }

    return rules.sort();
}

function getUniqueClassName(baseName, rules) {
    const rulesString = rules.join('');
    if (STYLE_CACHE.has(rulesString)) return STYLE_CACHE.get(rulesString);
    const hash = generateHash(rulesString);
    const className = `${baseName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${hash}`;
    STYLE_CACHE.set(rulesString, className);
    return className;
}

function traverseAndGenerate(node, cssLines) {
    if (!node) return;
    if (node.visualSpec) {
        const rules = generateCSSRules(node.visualSpec);
        if (rules.length > 0) {
            const className = getUniqueClassName(node.name || 'el', rules);
            node.className = className;
            const classDef = `.${className} {`;
            if (!cssLines.includes(classDef)) {
                cssLines.push(classDef);
                cssLines.push(rules.map(r => `  ${r}`).join('\n'));
                cssLines.push(`}`);
            }
        }
    }
    if (node.children) node.children.forEach(child => traverseAndGenerate(child, cssLines));
    if (node._known_variants) {
        node._known_variants.forEach(variant => {
            if (variant.visualSpec) {
                const rules = generateCSSRules(variant.visualSpec);
                if (rules.length > 0) {
                    const varClassName = getUniqueClassName(node.name || 'var', rules);
                    variant.className = varClassName;
                    const classDef = `.${varClassName} {`;
                    if (!cssLines.includes(classDef)) {
                        cssLines.push(classDef);
                        cssLines.push(rules.map(r => `  ${r}`).join('\n'));
                        cssLines.push(`}`);
                    }
                }
            }
            if (variant.children) variant.children.forEach(child => traverseAndGenerate(child, cssLines));
        });
    }
}

function generateDeterministicCSS(rootNode) {
    const cssLines = [];
    STYLE_CACHE.clear();
    traverseAndGenerate(rootNode, cssLines);
    return { cssContent: cssLines.join('\n\n'), updatedJson: rootNode };
}

module.exports = { generateDeterministicCSS };