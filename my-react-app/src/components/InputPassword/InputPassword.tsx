import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import styles from './InputPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { all } from '@awesome.me/kit-2b360de4fa/icons';

// @ts-ignore
library.add(...all);

export interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The interactive state of the input. */
  state?: 'Enabled' | 'Focus' | 'Disabled';
  /** Toggles the visibility of the password text (initial state). */
  showPassword?: boolean;
  /** Indicates if the input has content. */
  filled?: boolean;
  /** The text label displayed above the input field. */
  /** The text label displayed above the input field. */
  label: string;
  /** Error message to display (switches state to Error) */
  error?: string;
}

const InputPassword: React.FC<InputPasswordProps> = ({
  state = 'Enabled',
  label,
  placeholder,
  value,
  onChange,
  showPassword: initialShowPassword = false,
  filled,
  className,
  error,
  ...props
}) => {
  // Internal state management for toggling visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(initialShowPassword);

  const handleToggle = useCallback(() => {
    if (state !== 'Disabled') {
      setIsPasswordVisible(prev => !prev);
    }
  }, [state]);

  const currentType = isPasswordVisible ? 'text' : 'password';
  // Use 'eye-slash' when hidden, 'eye' when visible
  // @ts-ignore
  const iconName = isPasswordVisible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';

  const isDisabled = state === 'Disabled';
  const isFocus = state === 'Focus';
  const isFilled = filled || (value !== undefined && value !== null && String(value).length > 0);

  const inputClasses = clsx(
    styles.input_password,
    styles[`state_${state.toLowerCase()}`],
    {
      [styles.filled]: isFilled,
      [styles.state_focus]: isFocus,
    }
  );

  return (
    <div className={clsx(styles.input_password_wrapper, className)}>
      <label htmlFor={props.id || props.name} className={styles.label}>
        {label}
      </label>
      <div className={inputClasses}>
        <input
          type={currentType}
          disabled={isDisabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
        <div
          className={styles.toggle_icon}
          onClick={handleToggle}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
        >
          <FontAwesomeIcon icon={iconName as any} />
        </div>
      </div>
      {error && <span className={styles.error_text} style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default InputPassword;