# Component: Chip

## Description
A compact interactive element used for input, filtering, or actions.

## 1. AI Translation Rules (Figma → React)
The AI must map the Figma "State" variant into multiple React props:

* **Prop: `size`**
    * **Figma:** "Small" | "Regular"
    * **React:** Lowercase string (`'small' | 'regular'`). Default is `'regular'`.

* **Prop: `state` (Complex Mapping)**
    * **Figma "Disabled"** $\rightarrow$ Set React prop `disabled={true}`.
    * **Figma "Active"** $\rightarrow$ Set React prop `selected={true}` (Visual state: darker background/border).
    * **Figma "Focus"** $\rightarrow$ **DO NOT** create a `focus` prop. Instead, ensure the CSS includes a `:focus-visible` style that matches the screenshot.
    * **Figma "Enabled"** $\rightarrow$ Default state (no special props).

## 2. React Interface (The Source of Truth)
```typescript
export interface ChipProps {
  /** The text content of the chip */
  label: string;

  /** Controls size variations */
  size?: 'small' | 'regular';

  /** Visual state for "Active" variant in Figma */
  selected?: boolean;

  /** Standard HTML disabled attribute */
  disabled?: boolean;

  /** Click handler */
  onClick?: () => void;
}
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```tsx
import React from 'react';
import clsx from 'clsx';
import styles from './Chip.module.css';
import { ChipProps } from './Chip.types';

export const Chip: React.FC<ChipProps> = ({
  label,
  size = 'regular',
  selected = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={clsx(styles.chip, styles[size], {
        [styles.selected]: selected,
        // Note: Focus styles are handled via CSS :focus-visible
      })}
    >
      <span className={styles.label}>{label}</span>
    </button>
  );
};
```

