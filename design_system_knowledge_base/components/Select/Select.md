## Component Name
Select

## Description
The Select component is a custom dropdown menu that allows users to choose a single option from a list. It includes a visible label, placeholder text, and supports various visual states to provide clear user feedback. It is designed to be a presentational "controlled component" that perfectly matches the Figma design.

## 1. TypeScript Types (The "What")
This is the props interface for the Selector component. The AI must adhere to this structure.


```JSX
import React, { HTMLAttributes } from 'react';

// The props interface MUST extend the standard div attributes.
export interface SelectProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The text label displayed above the select field.
   */
  label: string;
  /**
   * The visual state of the component.
   * @default 'Enabled'
   */
  state?: 'Enabled' | 'Disabled' | 'Focus' | 'Active' | 'View mode';
  /**
   * Toggles the search input field within the dropdown.
   * @default false
   */
  search?: boolean;
  /**
   * Toggles the "Select All" and "Clear" actions.
   * @default false
   */
  quickActions?: boolean;
  /**
   * Optional placeholder text.
   */
  placeholder?: string;
}
```

## Example 
Follow this exact structure and naming convention. Do not deviate. 

```JSX
import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';
import clsx from 'clsx';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The text label displayed above the select field.
   */
  label: string;
  /**
   * The visual state of the component.
   * @default 'Enabled'
   */
  state?: 'Enabled' | 'Disabled' | 'Focus' | 'Active' | 'View mode';
  /**
   * Toggles the search input field within the dropdown.
   * @default false
   */
  search?: boolean;
  /**
   * Toggles the "Select All" and "Clear" actions.
   * @default false
   */
  quickActions?: boolean;
  /**
   * Optional placeholder text.
   */
  placeholder?: string;
}

// Dummy data for the dropdown options
const optionsData = ['Tesla', 'Google', 'Apple', 'Microsoft'];

const Select: React.FC<SelectProps> = ({
  label,
  state = 'Enabled',
  search = false,
  quickActions = false,
  placeholder = 'Place holder',
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isDisabled = state === 'Disabled' || state === 'View mode';
  
  const filteredOptions = optionsData.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleSelectAll = () => {
    // This is a placeholder for multi-select logic if needed in the future
    console.log("Select All clicked");
  };

  const handleClear = () => {
    setSelectedValue(null);
    setIsOpen(false);
  };

  const containerClassName = clsx(
    styles.select_container,
    {
      [styles.is_disabled]: isDisabled,
      [styles.is_active]: isOpen || state === 'Active',
      [styles.is_focus]: state === 'Focus',
    },
    className
  );

  return (
    <div className={styles.select_wrapper} ref={containerRef} {...props}>
      <label className={styles.label}>{label}</label>
      <div className={containerClassName} onClick={() => !isDisabled && setIsOpen(!isOpen)}>
        <span className={clsx(styles.value_text, { [styles.placeholder]: !selectedValue })}>
          {selectedValue || placeholder}
        </span>
        <span className={styles.arrow_icon}>▼</span>
      </div>
      {isOpen && !isDisabled && (
        <div className={styles.dropdown_panel}>
          {search && (
            <input
              type="text"
              className={styles.search_input}
              placeholder="Search content"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {quickActions && (
            <div className={styles.quick_actions}>
              <button onClick={handleSelectAll}>Select All</button>
              <button onClick={handleClear}>Clear</button>
            </div>
          )}
          <ul className={styles.options_list}>
            {filteredOptions.map((option) => (
              <li
                key={option}
                className={styles.option_item}
                onClick={() => {
                  setSelectedValue(option);
                  setIsOpen(false);
                }}
              >
                <input type="checkbox" checked={selectedValue === option} readOnly />
                <span>{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;


```

 

 