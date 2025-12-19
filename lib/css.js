/**
 * Converts a Figma color object to a CSS hex string.
 */
function figmaColorToHex(color) {
  if (!color) return '#000000';
  const toHex = (c) => Math.round(c * 255).toString(16).padStart(2, '0');
  const r = toHex(color.r);
  const g = toHex(color.g);
  const b = toHex(color.b);
  if (color.a < 1) {
    const a = toHex(color.a);
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`;
}

/**
 * Recursively searches the Figma document tree to find the node that defines a style.
 */
function findStyleDefinitionRecursive(node, styleId, styleType) {
  let typeKey;
  if (styleType === 'FILL') typeKey = 'fill';
  else if (styleType === 'STROKE') typeKey = 'stroke';
  else if (styleType === 'TEXT') typeKey = 'text';
  else return null;

  if (node.styles && node.styles[typeKey] === styleId) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findStyleDefinitionRecursive(child, styleId, styleType);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * A helper function to convert a Figma style name into a valid CSS class/variable name.
 */
function styleNameToCssName(name, prefix = '--') {
  return `${prefix}${name.toLowerCase().replace(/[\s/$]+/g, '-')}`;
}

/**
 * Recursively traverses the Figma node tree to find all unique LAYOUT spacing values.
 */
function findSpacingValues(node, spacingSet) {
  if (!node) return;
  const validNodeTypes = ['FRAME', 'COMPONENT', 'INSTANCE', 'GROUP'];
  if (validNodeTypes.includes(node.type)) {
    if (node.itemSpacing && node.itemSpacing > 0) spacingSet.add(node.itemSpacing);
    if (node.paddingLeft > 0) spacingSet.add(node.paddingLeft);
    if (node.paddingRight > 0) spacingSet.add(node.paddingRight);
    if (node.paddingTop > 0) spacingSet.add(node.paddingTop);
    if (node.paddingBottom > 0) spacingSet.add(node.paddingBottom);
  }
  if (node.children) {
    for (const child of node.children) {
      findSpacingValues(child, spacingSet);
    }
  }
}

/**
 * Extracts all unique spacing values and generates CSS variables with value-based names.
 */
function extractSpacingTokens(figmaFileData) {
  const spacingSet = new Set([0]);
  findSpacingValues(figmaFileData.document, spacingSet);
  const sortedSpacings = Array.from(spacingSet).sort((a, b) => a - b);
  const spacingMap = {};
  let spacingVarsContent = '';

  if (sortedSpacings.length > 1) {
    spacingVarsContent = '  /* Spacing Tokens */\n';
    sortedSpacings.forEach((value) => {
      // ✅ NEW: Naming convention is now based on the pixel value
      const varName = `--spacing-${value}`; 
      if (!spacingMap[value]) {
        spacingVarsContent += `  ${varName}: ${value}px;\n`;
        spacingMap[value] = varName;
      }
    });
  }
  return { spacingVarsContent, spacingMap };
}


function generateGlobalCss(stylesObject, figmaFileData) {
  const generatedVars = new Set();
  let colorVarsContent = '  /* Fill Color Tokens */\n';
  let borderVarsContent = '  /* Border Color Tokens */\n';
  let textVarsContent = '  /* Text Style Tokens */\n';
  const styleIdToMetadata = figmaFileData.styles;

  for (const styleId in styleIdToMetadata) {
    const style = styleIdToMetadata[styleId];
    const varName = styleNameToCssName(style.name, '--');
    
    const isBorderStyleByName = style.name.toLowerCase().startsWith('borders');

    if (isBorderStyleByName) {
        if (generatedVars.has(varName)) continue;
        const definitionNode = findStyleDefinitionRecursive(figmaFileData.document, styleId, 'STROKE');
        let colorValue = `/* Color not found for style: ${style.name} */`;
        if (definitionNode && definitionNode.strokes?.length > 0) {
            const solidStroke = definitionNode.strokes.find(s => s.type === 'SOLID' && s.color);
            if (solidStroke) {
                colorValue = figmaColorToHex(solidStroke.color);
            }
        }
        borderVarsContent += `  ${varName}: ${colorValue};\n`;
        generatedVars.add(varName);
    } else if (style.styleType === 'FILL') {
        if (generatedVars.has(varName)) continue;
        const definitionNode = findStyleDefinitionRecursive(figmaFileData.document, styleId, 'FILL');
        let colorValue = `/* Color not found for style: ${style.name} */`;
        if (definitionNode && definitionNode.fills?.length > 0) {
            const solidFill = definitionNode.fills.find(f => f.type === 'SOLID' && f.color);
            if (solidFill) {
                colorValue = figmaColorToHex(solidFill.color);
            }
        }
        colorVarsContent += `  ${varName}: ${colorValue};\n`;
        generatedVars.add(varName);
    } else if (style.styleType === 'TEXT') {
        const definitionNode = findStyleDefinitionRecursive(figmaFileData.document, styleId, 'TEXT');
        if (definitionNode && definitionNode.style) {
            const textStyle = definitionNode.style;
            const baseName = varName;
            if (textStyle.fontFamily && !generatedVars.has(`${baseName}-font-family`)) {
                textVarsContent += `  ${baseName}-font-family: '${textStyle.fontFamily}';\n`;
                generatedVars.add(`${baseName}-font-family`);
            }
            if (textStyle.fontWeight && !generatedVars.has(`${baseName}-font-weight`)) {
                textVarsContent += `  ${baseName}-font-weight: ${textStyle.fontWeight};\n`;
                generatedVars.add(`${baseName}-font-weight`);
            }
            if (textStyle.fontSize && !generatedVars.has(`${baseName}-font-size`)) {
                textVarsContent += `  ${baseName}-font-size: ${textStyle.fontSize}px;\n`;
                generatedVars.add(`${baseName}-font-size`);
            }
            if (textStyle.lineHeightPx && !generatedVars.has(`${baseName}-line-height`)) {
                textVarsContent += `  ${baseName}-line-height: ${textStyle.lineHeightPx.toFixed(2)}px;\n`;
                generatedVars.add(`${baseName}-line-height`);
            }
        }
    }
  }

  const { spacingVarsContent, spacingMap } = extractSpacingTokens(figmaFileData);
  const css = `:root {\n${colorVarsContent}\n${borderVarsContent}\n${textVarsContent}\n${spacingVarsContent}}`;
  
  return { css, spacingMap };
}

module.exports = { generateGlobalCss };