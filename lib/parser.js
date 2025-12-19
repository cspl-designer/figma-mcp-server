// lib/parser.js

/**
 * A helper to convert Figma's RGBA color object to a CSS hex string.
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
 * An updated helper to extract and correctly format styles from a Figma node.
 */
function getSimplifiedStyles(node) {
  const styles = {};
  if (node.fills?.length > 0 && node.fills[0].type === 'SOLID') {
    styles.backgroundColor = figmaColorToHex(node.fills[0].color);
  }
  if (node.strokes?.length > 0 && node.strokes[0].type === 'SOLID') {
    const borderColor = figmaColorToHex(node.strokes[0].color);
    styles.border = `${node.strokeWeight}px solid ${borderColor}`;
  }
  if (node.cornerRadius > 0) {
    styles.borderRadius = `${node.cornerRadius}px`;
  }
  return styles;
}

/**
 * Recursively parses a raw Figma node and its children into a clean, structured format.
 */
function parseFigmaNode(node) {
  if (!node) return null;
  const { name, type, absoluteBoundingBox, children } = node;
  const parsedNode = {
    name,
    type,
    position: {
      x: absoluteBoundingBox?.x,
      y: absoluteBoundingBox?.y,
      width: absoluteBoundingBox?.width,
      height: absoluteBoundingBox?.height,
    },
    layout: {
      display: (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') ? 'flex' : 'block',
      flexDirection: node.layoutMode === 'VERTICAL' ? 'column' : 'row',
      gap: node.itemSpacing || 0,
      padding: {
        top: node.paddingTop || 0,
        right: node.paddingRight || 0,
        bottom: node.paddingBottom || 0,
        left: node.paddingLeft || 0,
      }
    },
    styles: getSimplifiedStyles(node),
    text: node.characters || null,
    children: [],
  };
  if (children && children.length > 0) {
    parsedNode.children = children.map(parseFigmaNode).filter(Boolean);
  }
  return parsedNode;
}

module.exports = { parseFigmaNode };