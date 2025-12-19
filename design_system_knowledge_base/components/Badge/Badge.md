# Component: Badge

## Description
A numeric or text label used to indicate status, count, or state.

## 1. AI Translation Rules (Figma → React)
The AI must apply these logic transformations:

* **Prop: `status` (Semantic Mapping)**
    * **Figma "Info"** $\rightarrow$ `status="info"` (Blue)
    * **Figma "Success"** $\rightarrow$ `status="success"` (Green)
    * **Figma "Warning"** $\rightarrow$ `status="warning"` (Yellow/Orange)
    * **Figma "Danger"** $\rightarrow$ `status="error"` (Red)
    * **Figma "Normal"** $\rightarrow$ `status="neutral"` (Grey/Default)
    * **Figma "Active"** $\rightarrow$ `status="active"` (Brand color or Highlight)

* **Prop: `variant` (Visual Style)**
    * **Figma "Filled" (True)** $\rightarrow$ `variant="solid"` (Solid background, white text)
    * **Figma "Filled" (False)** $\rightarrow$ `variant="subtle"` (Light background, colored text)

* **Prop: `icon` logic**
    * **Figma "Icon" (False)** $\rightarrow$ Do not render an icon.
    * **Figma "Icon" (True)** $\rightarrow$ Render an icon component.
    * **Figma "Filled icon" (True)** $\rightarrow$ Use the "Solid" version of the icon set (e.g., `<Icon variant="filled" />`).

## 2. React Interface
```typescript
export interface BadgeProps {
  /** The text content */
  label: string;

  /** Semantic color state */
  status?: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'active';

  /** Visual style: solid vs subtle */
  variant?: 'solid' | 'subtle';

  /** Size of the badge */
  size?: 'small' | 'regular';

  /** Optional icon to display before text */
  icon?: React.ReactNode;
}   
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```tsx

import React from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './BadgeText.module.css';
import { BadgeTextProps } from './BadgeText.types';

export const BadgeText: React.FC<BadgeTextProps> = ({
  label,
  status = 'neutral',
  variant = 'subtle',
  size = 'regular',
  hasIcon = false,
}) => {
  
  // Helper to determine icon based on status
  const getIconName = () => {
    switch (status) {
      case 'success': return 'fa-solid fa-check';
      case 'warning': return 'fa-solid fa-triangle-exclamation';
      case 'error': return 'fa-solid fa-circle-exclamation';
      case 'info': return 'fa-solid fa-circle-info';
      default: return 'fa-solid fa-circle'; // Neutral default
    }
  };

  return (
    <span
      className={clsx(
        styles.badge,
        styles[status],
        styles[variant],
        styles[size]
      )}
    >
      {hasIcon && (
        <span className={styles.iconWrapper}>
           <FontAwesomeIcon icon={getIconName() as any} />
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </span>
  );
};

```
