# Component: Avatar

## Description
A circular component used to represent a user or entity. It supports images, text initials, or icons.

## 1. AI Translation Rules (Figma → React)
The AI must map Figma variants to clean React props using these rules:

* **Prop: `size` (Size Mapping)**
    * **Figma "Extra Small"** $\rightarrow$ `size="xs"`
    * **Figma "Small"** $\rightarrow$ `size="sm"`
    * **Figma "Medium"** $\rightarrow$ `size="md"` (Default)
    * **Figma "Large"** $\rightarrow$ `size="lg"`
    * **Figma "Extra Large"** $\rightarrow$ `size="xl"`

* **Prop: `type` (Content Logic)**
    * **Figma "Image"** $\rightarrow$ The AI should generate a `src` prop with a placeholder URL (e.g., `https://i.pravatar.cc/150`).
    * **Figma "Text"** $\rightarrow$ The AI should generate an `initials` prop (e.g., `initials="JD"`).
    * **Figma "Icon"** $\rightarrow$ The AI should render an `Icon` component inside the Avatar.

* **Prop: `status`**
    * **Figma "Normal"** $\rightarrow$ Ignore this (it is the default state).
    * If you detect other states in the future (e.g. "Online"), map them to a `status` prop.

## 2. React Interface
```typescript
export interface AvatarProps {
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Image source URL (used if type is Image) */
  src?: string;
  
  /** Alt text for accessibility */
  alt?: string;
  
  /** Text initials (used if type is Text) */
  initials?: string;
  
  /** Optional icon to render (used if type is Icon) */
  icon?: React.ReactNode;
}
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```tsx

import React from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assumes library is initialized in App root as per your project pattern
import styles from './Avatar.module.css';
import { AvatarProps } from './Avatar.types';

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  src,
  alt = 'User Avatar',
  initials,
  iconName = 'fa-solid fa-user', // Default generic user icon
}) => {
  const renderContent = () => {
    if (src) return <img src={src} alt={alt} className={styles.image} />;
    if (initials) return <span className={styles.initials}>{initials}</span>;
    
    // Fallback to Icon
    return (
      <span className={styles.iconWrapper}>
        <FontAwesomeIcon icon={iconName as any} />
      </span>
    );
  };

  return (
    <div className={clsx(styles.avatar, styles[size])}>
      {renderContent()}
    </div>
  );
};

```
