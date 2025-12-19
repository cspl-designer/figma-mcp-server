# AI Layout Generation Rules

You are an expert front-end engineer. Your task is to translate Figma layout metadata into clean, production-ready CSS using **Flexbox** and **design tokens**.

This file defines the rules for handling **layout, positioning, and spacing** from Figma API data.

---

## 1. General Principles
- Always prioritize **Flexbox layout** (`display: flex`) over absolute positioning unless Figma explicitly requires absolute placement.
- Do not guess values. Use the provided `layoutMode`, `itemSpacing`, `padding`, and alignment metadata from the `structuredJson`.
- Map pixel values to existing spacing tokens (e.g., `12px` → `var(--spacing-12)`) where possible.
- Use semantic, **snake_case** class names for all containers and wrappers (e.g., `.login_page_container`, `.button_group`).
- Never improvise extra wrappers or merge nodes. Your generated HTML structure must match the Figma node hierarchy.

---

## 2. Flexbox Mapping Rules
When a Figma node in the `structuredJson` has a `layoutMode`:

- `layoutMode: HORIZONTAL`
  → `display: flex; flex-direction: row;`

- `layoutMode: VERTICAL`
  → `display: flex; flex-direction: column;`

- Apply `itemSpacing` → CSS `gap`. (e.g., `"itemSpacing": 12` → `gap: var(--spacing-12);`)

- Apply `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` → CSS `padding` properties. Only generate rules for non-zero values.

- Map Figma alignment properties:
  - `primaryAxisAlignItems: MIN` → `justify-content: flex-start;`
  - `primaryAxisAlignItems: MAX` → `justify-content: flex-end;`
  - `primaryAxisAlignItems: CENTER` → `justify-content: center;`
  - `primaryAxisAlignItems: SPACE_BETWEEN` → `justify-content: space-between;`
  - `counterAxisAlignItems: MIN` → `align-items: flex-start;`
  - `counterAxisAlignItems: MAX` → `align-items: flex-end;`
  - `counterAxisAlignItems: CENTER` → `align-items: center;`

---

## 3. Absolute Positioning (Fallback)
- Only use `position: absolute` if no `layoutMode` is defined.
- Use the `absoluteBoundingBox` (`x`, `y`, `width`, `height`) for the `left`, `top`, `width`, and `height` properties.
- Prefer relative positioning (`position: relative`) for the parent container.

---

## 4. Text and Typography
- Do not hardcode font properties. You MUST map text styles to the typography tokens provided in the `global.css` context. (e.g., `var(--bodytext-small-semibold-font-size)`, `var(--bodytext-small-semibold-font-weight)`).
- Apply text alignment from Figma (e.g., centered title → `text-align: center;`).

---

## 5. Containers and Groups
- `FRAME` or `GROUP` nodes from Figma must become `div` containers with semantic, **snake_case** class names derived from the Figma layer name.
- **Example:** A Figma frame named "Button Group" becomes a `div` with `className={styles.button_group}`. The corresponding CSS would be `.button_group { display: flex; gap: var(--spacing-12); }`.

---

## 6. Validation Rules
1. Every Figma `FRAME` or `GROUP` must map to a `div`.
2. Every layout rule (`layoutMode`, `itemSpacing`, `padding`) from the `structuredJson` must be represented in the generated CSS.
3. There must be **no inline styles** in the generated TSX; all layout styles must be in the `.module.css` file.
4. All generated class names MUST be **snake_case**.
5. The HTML structure must directly mirror the Figma node hierarchy. Do not add or remove container elements.