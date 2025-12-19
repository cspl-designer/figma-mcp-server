import React, { type InputHTMLAttributes } from 'react';
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
   * Alias for errorText to support generated code.
   */
  error?: string;
  /**
   * Optional placeholder text.
   */
  placeholder?: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  state: propState = 'Enabled',
  errorText,
  error,
  className,
  placeholder,
  value,
  onChange,
  id,
  name,
  ...props
}) => {
  // Ensure we have an ID for accessibility linking
  const inputId = id || name || `input-text-${Math.random().toString(36).substring(2, 9)}`;

  // Resolve final error text and state
  const finalErrorText = error || errorText;
  const state = finalErrorText ? 'Error' : propState;

  const isDisabled = state === 'Disabled';

  // Base class for the overall component wrapper (Figma Root)
  const containerClassName = clsx(styles.input_text_container, className);

  // Class for the input wrapper (.items)
  const itemsClassName = clsx(
    styles.items,
    styles[`state_${state.toLowerCase()}`]
  );

  // The Figma structure explicitly includes the required indicator ("star-of-life").
  const showRequiredIndicator = true;

  return (
    <div className={containerClassName}>
      {/* Figma Node: Label (Wrapper for indicator and text) */}
      <div className={styles.label_wrapper}>
        {/* Figma Node: star-of-life */}
        {showRequiredIndicator && (
          <span className={styles.required_indicator}>*</span>
        )}
        {/* Figma Node: Label Text */}
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      </div>

      {/* Figma Node: .items (Input Wrapper) */}
      <div className={itemsClassName}>
        {/* Figma Node: Text Input (Mapped to <input>) */}
        <input
          id={inputId}
          className={styles.text_input}
          disabled={isDisabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>

      {/* Error Text */}
      {state === 'Error' && finalErrorText && (
        <span className={styles.error_text}>{finalErrorText}</span>
      )}
    </div>
  );
};

export default InputText;