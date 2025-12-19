## Component Name
Selector

## Description
The Selector component is a stateful, segmented control that allows a user to select one option from a set. It includes an optional visible label and is designed to be a presentational "controlled component" that perfectly matches the Figma design.

## 1. TypeScript Types (The "What")
This is the props interface for the Selector component. The AI must adhere to this structure.


```JSX
import React from 'react';

export interface SelectorProps {
  /**
   * The text label displayed above the component.
   * @default false
   */
  label?: boolean;
  /**
   * The number of selectable segments.
   * @default 'Three'
   */
  options?: 'One' | 'Two' | 'Three' | 'Four';
}
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```JSX
import React from 'react';
import clsx from 'clsx';
import styles from './Selector.module.css';

// The props are flexible, accepting an array of option objects.
export interface SelectorProps {
  label?: string; // Optional label for the whole component
  options: {
    label: string;
    value: string;
  }[];
  value: string; // The currently selected value
  onChange: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({
  label,
  options,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className={styles.selector_wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selector_container} {...props}>
        {/* Mmap directly over the 'options' prop array */}
        {options.map((option) => (
          <button
            key={option.value}
            className={clsx(styles.segment, { [styles.active]: value === option.value })}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector;

```

 

 