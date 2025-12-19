// lib/figma.js

const { figmaStyleNameToCssVar } = require('./utils.js');
const { parseFigmaNode } = require('./parser.js'); // ✅ This line is essential

function findChildNodeByName(node, targetName) {
    if (!node) return null;
    if (node.name.toLowerCase() === targetName.toLowerCase()) return node;
    if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
            const found = findChildNodeByName(child, targetName);
            if (found) return found;
        }
    }
    return null;
}

function extractPropsFromFigma(componentNode, manifest) {
    const props = {};
    if (!manifest.figmaMapping) return props;
    if (manifest.figmaMapping.text) {
        for (const [figmaTextName, propName] of Object.entries(manifest.figmaMapping.text)) {
            const textNode = findChildNodeByName(componentNode, figmaTextName);
            if (textNode && textNode.characters) props[propName] = textNode.characters;
        }
    }
    if (manifest.figmaMapping.properties && componentNode.componentProperties) {
        for (const [figmaPropName, codePropName] of Object.entries(manifest.figmaMapping.properties)) {
            const figmaProp = componentNode.componentProperties[figmaPropName];
            if (figmaProp && typeof figmaProp.value !== 'undefined') props[codePropName] = String(figmaProp.value);
        }
    }
    return props;
}

function extractStylesFromNode(node, figmaStyles, spacingMap) {
    let css = '';
    const fillStyleId = node.styles?.fill;
    if (fillStyleId && figmaStyles[fillStyleId]) {
        css += `  background-color: ${figmaStyleNameToCssVar(figmaStyles[fillStyleId].name)};\n`;
    }
    const strokeStyleId = node.styles?.stroke;
    if (strokeStyleId && figmaStyles[strokeStyleId] && node.strokeWeight) {
        const borderVar = figmaStyleNameToCssVar(figmaStyles[strokeStyleId].name);
        css += `  border: ${node.strokeWeight}px solid ${borderVar};\n`;
    }
    if (typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
        css += `  border-radius: ${node.cornerRadius}px;\n`;
    }
    if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
        css += `  display: flex;\n`;
        css += `  flex-direction: ${node.layoutMode === 'HORIZONTAL' ? 'row' : 'column'};\n`;
        if (node.itemSpacing > 0 && spacingMap && spacingMap[node.itemSpacing]) {
            css += `  gap: var(${spacingMap[node.itemSpacing]});\n`;
        }
        if (node.paddingTop > 0 && spacingMap && spacingMap[node.paddingTop]) {
            css += `  padding-top: var(${spacingMap[node.paddingTop]});\n`;
        }
        if (node.paddingRight > 0 && spacingMap && spacingMap[node.paddingRight]) {
            css += `  padding-right: var(${spacingMap[node.paddingRight]});\n`;
        }
        if (node.paddingBottom > 0 && spacingMap && spacingMap[node.paddingBottom]) {
            css += `  padding-bottom: var(${spacingMap[node.paddingBottom]});\n`;
        }
        if (node.paddingLeft > 0 && spacingMap && spacingMap[node.paddingLeft]) {
            css += `  padding-left: var(${spacingMap[node.paddingLeft]});\n`;
        }
    }
    return css;
}

function findAndExtractComponentsRecursively(node, componentManifests, figmaStyles, foundComponents, spacingMap) {
  if (!node) return;
  
  for (const manifest of Object.values(componentManifests)) {
    if (node.name.toLowerCase() === manifest.figmaNodeName.toLowerCase()) {
      const props = extractPropsFromFigma(node, manifest);
      const css = extractStylesFromNode(node, figmaStyles, spacingMap);
      const structuredJson = parseFigmaNode(node);
      
      foundComponents.push({
        componentName: manifest.componentName,
        props: props,
        css: `.${manifest.componentName.toLowerCase().replace(/\s+/g, '-')} {\n${css}}`,
        figmaNodeId: node.id,
        structuredJson: structuredJson,
      });
    }
  }

  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      findAndExtractComponentsRecursively(child, componentManifests, figmaStyles, foundComponents, spacingMap);
    }
  }
}

module.exports = { findAndExtractComponentsRecursively };