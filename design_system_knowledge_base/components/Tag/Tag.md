# Component: Tag

## Description
A static, read-only element used for categorization or labeling status. Unlike "Chips", Tags are generally not interactive.

## 1. AI Translation Rules (Figma → React)
The AI must apply these rules to clean up the Figma data:

* **Prop: `size`**
    * **Figma:** "Small" | "Regular" | "Larg" (Note: "Larg" is a known typo in Figma)
    * **React:** Lowercase string (`'small' | 'regular' | 'large'`).
    * **Logic:**
        * If Figma = "Small" $\rightarrow$ `size="small"`
        * If Figma = "Regular" $\rightarrow$ `size="regular"`
        * If Figma = "Larg" $\rightarrow$ `size="large"` (Auto-correct this value)

* **Content:**
    * Extract the text content from the Figma layer and pass it as the `label` prop.

## 2. React Interface
```typescript
export interface TagProps {
  /** The text content of the tag */
  label: string;

  /** Controls size variations */
  size?: 'small' | 'regular' | 'large';

  /** Optional color theme (e.g., for status tags like 'Success' or 'Error') */
  variant?: 'default' | 'success' | 'warning' | 'error';
}
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```tsx


import React from 'react';
import clsx from 'clsx';
import styles from './Tag.module.css';
import { TagProps } from './Tag.types';

export const Tag: React.FC<TagProps> = ({
  label,
  size = 'regular',
  variant = 'default',
}) => {
  return (
    <span
      className={clsx(styles.tag, styles[size], styles[variant])}
    >
      {label}
    </span>
  );
};


```