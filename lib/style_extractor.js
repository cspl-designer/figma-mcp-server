// lib/style_extractor.js

function rgbToHex(r, g, b, a) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return a !== undefined && a < 1 ? `${hex}${Math.round(a * 255).toString(16)}` : hex;
}

function parseColor(node, tokenLookup, type = 'fill') {
    if (node.styles) {
        const styleId = type === 'stroke' ? node.styles.stroke : node.styles.fill;
        if (styleId && tokenLookup) {
            const token = tokenLookup(styleId);
            if (token) return `var(${token.name})`;
        }
    }
    const source = type === 'stroke' ? node.strokes : node.fills;
    if (!source || source.length === 0) return undefined;
    const paint = source.find(f => f.visible !== false && f.type === 'SOLID');
    if (paint) {
        return rgbToHex(paint.color.r, paint.color.g, paint.color.b, paint.opacity);
    }
    return undefined;
}

function extractTypography(node, tokenLookup) {
    if (!node.style) return undefined;
    if (node.styles && node.styles.text && tokenLookup) {
        const token = tokenLookup(node.styles.text);
        if (token && token.type === 'TEXT') {
            return {
                fontFamily: `var(${token.name}-font-family, "${node.style.fontFamily}")`,
                fontWeight: `var(${token.name}-font-weight, ${node.style.fontWeight})`,
                fontSize: `var(${token.name}-font-size, ${node.style.fontSize}px)`,
                lineHeight: `var(${token.name}-line-height, ${node.style.lineHeightPx ? Math.round(node.style.lineHeightPx) + 'px' : 'normal'})`,
                color: parseColor(node, tokenLookup, 'fill'),
                raw: { size: node.style.fontSize, weight: node.style.fontWeight }
            };
        }
    }
    return {
        fontFamily: node.style.fontFamily,
        fontWeight: node.style.fontWeight,
        fontSize: `${node.style.fontSize}px`,
        lineHeight: node.style.lineHeightPx ? `${Math.round(node.style.lineHeightPx)}px` : 'normal',
        color: parseColor(node, tokenLookup, 'fill'),
        raw: { size: node.style.fontSize, weight: node.style.fontWeight }
    };
}

function extractEffects(node) {
    if (!node.effects || node.effects.length === 0) return undefined;
    const shadows = node.effects
        .filter(e => e.visible !== false && (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW'))
        .map(e => {
            const color = rgbToHex(e.color.r, e.color.g, e.color.b, e.color.a);
            const inset = e.type === 'INNER_SHADOW' ? 'inset ' : '';
            return `${inset}${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread || 0}px ${color}`;
        });
    return shadows.length > 0 ? shadows.join(', ') : undefined;
}

function getSizingConstraints(node) {
    let horizontal = 'Fixed';
    let vertical = 'Fixed';
    if (node.layoutAlign === 'STRETCH') horizontal = 'Fill (Stretch)';
    if (node.layoutGrow === 1) horizontal = 'Fill (Grow)';
    if (node.layoutMode === 'HORIZONTAL') {
        if (node.primaryAxisSizingMode === 'AUTO') horizontal = 'Hug';
        if (node.counterAxisSizingMode === 'AUTO') vertical = 'Hug';
    } else if (node.layoutMode === 'VERTICAL') {
        if (node.primaryAxisSizingMode === 'AUTO') vertical = 'Hug';
        if (node.counterAxisSizingMode === 'AUTO') horizontal = 'Hug';
    }
    return { horizontal, vertical };
}

function findFirstTextNode(node, depth = 0) {
    if (depth > 3) return null;
    if (!node.children) return null;
    for (const child of node.children) {
        if (child.visible !== false) {
            if (child.type === 'TEXT') return child;
            const found = findFirstTextNode(child, depth + 1);
            if (found) return found;
        }
    }
    return null;
}

// ✅ MAIN EXTRACTOR
function extractVisualSpec(node, tokenLookup) {
    const spec = {};

    if (node.type === 'TEXT') {
        spec.typography = extractTypography(node, tokenLookup);
    }

    if (['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP', 'RECTANGLE', 'SECTION'].includes(node.type)) {
        const constraints = getSizingConstraints(node);
        const hasVisibleStroke = node.strokes && node.strokes.some(s => s.visible !== false && s.type === 'SOLID');
        let borderWidth = '0px';
        let borderSideProps = {};

        if (hasVisibleStroke) {
            if (node.individualStrokeWeights) {
                const { top, bottom, left, right } = node.individualStrokeWeights;
                if (top > 0) borderSideProps.borderTopWidth = `${top}px`;
                if (bottom > 0) borderSideProps.borderBottomWidth = `${bottom}px`;
                if (left > 0) borderSideProps.borderLeftWidth = `${left}px`;
                if (right > 0) borderSideProps.borderRightWidth = `${right}px`;
                borderWidth = '0px';
            } else if (node.strokeWeight) {
                borderWidth = `${node.strokeWeight}px`;
            }
        }

        // Determine Display Mode
        // ✅ FIX: Default to 'block' (normal frame) if layoutMode is missing, NOT 'none'
        let display = 'block';
        if (node.layoutMode === 'VERTICAL' || node.layoutMode === 'HORIZONTAL') {
            display = 'flex';
        }

        spec.box = {
            width: node.absoluteBoundingBox ? `${Math.round(node.absoluteBoundingBox.width)}px` : 'auto',
            height: node.absoluteBoundingBox ? `${Math.round(node.absoluteBoundingBox.height)}px` : 'auto',
            constraints: { widthMode: constraints.horizontal, heightMode: constraints.vertical },
            display: display,
            flexDirection: node.layoutMode === 'VERTICAL' ? 'column' : (node.layoutMode === 'HORIZONTAL' ? 'row' : undefined),

            // ✅ NEW: Support for Auto Layout Wrap
            flexWrap: node.layoutWrap === 'WRAP' ? 'wrap' : undefined,

            gap: node.itemSpacing ? `${node.itemSpacing}px` : '0px',
            alignItems: node.counterAxisAlignItems ? node.counterAxisAlignItems.toLowerCase() : undefined,
            justifyContent: node.primaryAxisAlignItems ? node.primaryAxisAlignItems.toLowerCase() : undefined,
            padding: node.paddingTop ? `${node.paddingTop}px ${node.paddingRight}px ${node.paddingBottom}px ${node.paddingLeft}px` : '0px',
            backgroundColor: parseColor(node, tokenLookup, 'fill'),
            borderColor: parseColor(node, tokenLookup, 'stroke'),
            borderWidth: borderWidth,
            ...borderSideProps,
            borderRadius: node.cornerRadius ? `${node.cornerRadius}px` : '0px',
            boxShadow: extractEffects(node)
        };

        // Grid Override (If explicitly configured as Layout Grid on a Frame)
        if (node.layoutGrids && node.layoutGrids.length > 0) {
            const columnGrid = node.layoutGrids.find(g => g.visible !== false && (g.pattern === 'COLUMNS' || g.pattern === 'GRID'));
            if (columnGrid) {
                spec.box.display = 'grid';
                delete spec.box.flexDirection;
                delete spec.box.justifyContent;
                delete spec.box.flexWrap; // Grid doesn't need flex-wrap

                if (columnGrid.pattern === 'COLUMNS') {
                    spec.box.gridTemplateColumns = `repeat(${columnGrid.count}, 1fr)`;
                } else if (columnGrid.pattern === 'GRID') {
                    spec.box.gridTemplateColumns = `repeat(auto-fill, minmax(${columnGrid.sectionSize}px, 1fr))`;
                }
                if (columnGrid.gutterSize) spec.box.gap = `${columnGrid.gutterSize}px`;
                spec.box.justifyItems = 'center';
                spec.box.alignItems = 'center';
            }
        }

        const nestedText = findFirstTextNode(node);
        if (nestedText) spec.typography = extractTypography(nestedText, tokenLookup);
    }

    return spec;
}

module.exports = { extractVisualSpec };