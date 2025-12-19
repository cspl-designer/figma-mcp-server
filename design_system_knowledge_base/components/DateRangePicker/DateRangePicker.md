# Component: DateRangePicker

## Description
A form input allowing the user to select a start and end date.

## 1. AI Translation Rules (Figma → React)
The AI must interpret the Figma "State" variant to determine props and data simulation:

* **Prop: `disabled`**
    * **Figma:** "Disabled" $\rightarrow$ Set `disabled={true}`.

* **Prop: `readOnly`**
    * **Figma:** "View mode" $\rightarrow$ Set `readOnly={true}` (Render as text or non-editable input).

* **State Simulation (Data Presence)**
    * **Figma "Filled"** $\rightarrow$ The AI must generate dummy data props: `startDate={new Date()}` and `endDate={new Date()}` to match the design.
    * **Figma "Enabled"** $\rightarrow$ Pass `null` or empty strings for values (Empty state).

* **Visual States (CSS)**
    * **Figma "Focusd"** (Note typo in Figma source) $\rightarrow$ Do not create a prop. Ensure CSS has `:focus-within` styles applied.
    * **Figma "Active"** $\rightarrow$ Simulate the calendar popover being open (if applicable in the screenshot) or apply active border styles.

## 2. React Interface
```typescript
export interface DateRangePickerProps {
  /** The start date value */
  startDate?: Date | null;

  /** The end date value */
  endDate?: Date | null;

  /** Callback when range changes */
  onChange?: (range: { start: Date | null; end: Date | null }) => void;

  /** Disables interaction */
  disabled?: boolean;

  /** Display-only mode */
  readOnly?: boolean;

  /** Placeholder text */
  placeholder?: string;
  
  /** Label displayed above input */
  label?: string;
}

```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```tsx
import React from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Library initialization assumed in App root (e.g. library.add(...all))
import styles from './DateRangePicker.module.css';
import { DateRangePickerProps } from './DateRangePicker.types';

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  disabled = false,
  readOnly = false,
  label,
}) => {
  const displayValue = startDate && endDate 
    ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    : '';

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
          placeholder="Start date - End date"
        />
        <span className={styles.iconWrapper}>
           {/* using string format as requested */}
           <FontAwesomeIcon icon="fa-solid fa-calendar" as any />
        </span>
      </div>
    </div>
  );
};

```