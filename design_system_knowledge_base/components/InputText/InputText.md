## Component Name
InputText

## Description
The InputText component is a standard form element for single-line text input. It includes a visible label, placeholder text, and supports different visual states (e.g., 'Enabled', 'Disabled', 'Error') to provide clear feedback to the user. It is designed to be a presentational "controlled component" that perfectly matches the Figma design.

## 1. TypeScript Types (The "What")
This is the props interface for the InputText component. The AI must adhere to this structure.

```JSX
import React, { InputHTMLAttributes } from 'react';

// The props interface MUST extend the standard input attributes.
export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
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
   * An optional error message to display below the input.
   */
  errorText?: string;
  /**
   * Optional placeholder text.
   */
  placeholder?: string;
}
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```JSX
import React, { InputHTMLAttributes } from 'react';
import styles from './InputText.module.css';
import clsx from 'clsx';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
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
   * An optional error message to display below the input.
   */
  errorText?: string;
  /**
   * Optional placeholder text.
   */
  placeholder?: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  state = 'Enabled',
  errorText,
  className,
  placeholder,
  value,
  onChange,
  ...props
}) => {
  const containerClassName = clsx(
     styles['input_text'] // component base class name from [componentName].module.css
  );

  const isDisabled = state === 'Disabled';

  return (
    <div className= "input_container">
      <label htmlFor={props.id || props.name} className={styles.label}>
        {label}
      </label>
      <input
        className={containerClassName}
        disabled={isDisabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {state === 'Error' && errorText && (
        <span className={styles['error_text']}>{errorText}</span>
      )}
    </div>
  );
};

export default InputText;


```

 

 