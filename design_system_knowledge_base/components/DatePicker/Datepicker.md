# Component: DatePicker

## Description
A form input allowing the user to select a single date via a calendar interface.

## 1. AI Translation Rules (Figma → React)
The AI must interpret the Figma "State" variant to determine props and data simulation:

* **Prop: `disabled`**
    * **Figma:** "Disabled" $\rightarrow$ Set `disabled={true}`.

* **Prop: `readOnly`**
    * **Figma:** "View mode" $\rightarrow$ Set `readOnly={true}` (Render as text or non-editable input).

* **State Simulation (Data Presence)**
    * **Figma "Filled"** $\rightarrow$ The AI must generate a dummy date value: `value={new Date()}`.
    * **Figma "Enabled"** $\rightarrow$ Pass `null` or empty string for value (Empty state).

* **Visual States (CSS)**
    * **Figma "Focus"** $\rightarrow$ Do not create a prop. Ensure CSS has `:focus-within` styles applied.
    * **Figma "Active"** $\rightarrow$ Simulate the calendar popover being open (if applicable).

## 2. React Interface

```typescript
export interface DatePickerProps {
  /** The current date value */
  value?: Date | null;

  /** Callback when date changes */
  onChange?: (date: Date | null) => void;

  /** Disables interaction */
  disabled?: boolean;

  /** Display-only mode */
  readOnly?: boolean;

  /** Label displayed above input */
  label?: string;

  /** Placeholder text */
  placeholder?: string;
}

```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```tsx
import React from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Library initialization assumed in App root
import styles from './DatePicker.module.css';
import { DatePickerProps } from './DatePicker.types';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  label,
  placeholder = 'Select date',
}) => {
  const displayValue = value ? value.toLocaleDateString() : '';

  return (
    <div className={clsx(styles.wrapper, { [styles.disabled]: disabled })}>
      {label && <label className={styles.label}>{label}</label>}
      <div 
        className={styles.inputContainer}
        aria-disabled={disabled}
        aria-readonly={readOnly}
      >
        <input 
          type="text" 
          value={displayValue} 
          readOnly 
          disabled={disabled || readOnly}
          className={styles.input}
          placeholder={placeholder}
          onChange={(e) => {
             // Placeholder for manual typing logic if needed
          }}
        />
        <span className={styles.iconWrapper}>
           {/* using string format matching your system */}
           <FontAwesomeIcon icon="fa-solid fa-calendar" as any />
        </span>
      </div>
    </div>
  );
};

```

