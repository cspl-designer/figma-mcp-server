## Component Name

InputPassword

## Description

The InputPassword component is a secure form element for password entry. It includes a visible label, placeholder text, and an icon to toggle the visibility of the input's content. It is designed to be a presentational component that perfectly matches the Figma design.

---
## 1. TypeScript Types 

This is the props interface for the `InputPassword` component. The AI must adhere to this structure.

The generated code for both files MUST follow the exact same patterns, structure, and class naming conventions as the "Gold Standard" examples provided above. 

The clsx logic for combining variant classes is especially critical. Use created exact CSS class names in the TSX file `(E.g:className={clsx(styles.input_password, {....)`

## Example 
Follow this exact structure and naming convention. Do not deviate.

```tsx
import React, { InputHTMLAttributes } from 'react';

// The props interface MUST extend the standard input attributes.
export interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * The text label displayed above the input field.
   */
  label: string;
  /**
   * The visual state of the component.
   * @default 'Enabled'
   */
  state?: 'Enabled' | 'Disabled' | 'Error';
  /**
   * An optional error message to display.
   */ 
  errorText?: string;
  /**
   * Toggles the visibility of the password text.
   * @default false
   */
  showPassword?: boolean;
}
```
## 2. Gold Standard TSX Code Example 
```JSX
import React from 'react';
import clsx from 'clsx';
import styles from './InputPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { all } from '@awesome.me/kit-2b360de4fa/icons'

library.add(...all)

export interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  state?: 'Enabled' | 'Disabled' | 'Error';
  errorText?: string;
  showPassword?: boolean;
}

const InputPassword: React.FC<InputPasswordProps> = ({
  state = 'Enabled',
  errorText,
  showPassword = false,
  className,
  ...props // Pass down other props like value, placeholder, etc.
}) => {
 
  const isDisabled = state === 'Disabled';

  return (
    <div className="input_password_wrapper">
      <label htmlFor={props.id || props.name} className={styles.label}>
        {label}
      </label>
      <div className={styles.input_password}>
        <input 
          type={showPassword ? 'text' : 'password'}
          disabled={isDisabled}
          {...props}
        />
        <div className={styles['toggle_icon']}>
          <FontAwesomeIcon icon="fa-solid fa-eye" />
        </div>
      </div>
      {state === 'Error' && errorText && (
        <span className={styles['error-text']}>{errorText}</span>
      )}
    </div>
  );
};

export default InputPassword;
```
 
