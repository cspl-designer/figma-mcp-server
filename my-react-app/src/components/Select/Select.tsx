import React, { useState, useRef, useEffect } from 'react';
import type { HTMLAttributes } from 'react';
import styles from './Select.module.css';
import clsx from 'clsx';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  state?: 'Enabled' | 'Disabled' | 'Focus' | 'Active' | 'View mode';
  search?: boolean;
  quickActions?: boolean;
  placeholder?: string;
  options?: SelectOption[] | string[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  state = 'Enabled',
  search = false,
  quickActions = false,
  placeholder = 'Select',
  className,
  options = [],
  value,
  onChange,
  name,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isDisabled = state === 'Disabled' || state === 'View mode';

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = React.useMemo(() => {
    if (!options) return [];
    return options.map(opt => (typeof opt === 'string' ? { label: opt, value: opt } : opt));
  }, [options]);

  const filteredOptions = normalizedOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
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
      {label && <label className={styles.label}>{label}</label>}
      <div className={containerClassName} onClick={() => !isDisabled && setIsOpen(!isOpen)}>
        <span className={clsx(styles.value_text, { [styles.placeholder]: !selectedOption })}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.arrow_icon}>▼</span>
      </div>
      {isOpen && !isDisabled && (
        <div className={styles.dropdown_panel}>
          {search && (
            <input
              type="text"
              className={styles.search_input}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <ul className={styles.options_list}>
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={styles.option_item}
                onClick={() => handleSelect(option.value)}
              >
                <input type="checkbox" checked={value === option.value} readOnly />
                <span>{option.label}</span>
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className={styles.option_item} style={{ color: '#999', cursor: 'default' }}>No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;