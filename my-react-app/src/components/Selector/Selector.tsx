import React from 'react';
import clsx from 'clsx';
import styles from './Selector.module.css';

export interface SelectorOption {
    label: string;
    value: string;
}

export interface SelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Optional label for the whole component */
    label?: string;
    /** Array of selectable options */
    options: SelectorOption[];
    /** The currently selected value */
    value: string;
    /** Callback function when an option is selected */
    onChange: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({
    label,
    options,
    value,
    onChange,
    className,
    ...props
}) => {
    if (!options || options.length === 0) {
        return null;
    }

    return (
        <div className={styles.selector_wrapper}>
            {label && <label className={styles.label}>{label}</label>}

            <div className={clsx(styles.selector_container, className)} {...props}>
                {options.map((option) => {
                    const isActive = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={clsx(styles.segment, { [styles.active]: isActive })}
                            onClick={() => onChange(option.value)}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Selector;