import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emphasis?: 'Primary' | 'Secondary' | 'Tertiary';
  size?: 'Regular' | 'Small' | 'Extra Small';
  iconLeft?: boolean;
  iconRight?: boolean;
  state?: 'Disabled' | 'Normal' | 'Hover' | 'Focus' | 'Active';
  deletable?: boolean;
  label: string;
}

// Placeholder for Icon component
const IconPlaceholder: React.FC = () => <span className={styles.icon_placeholder}></span>;

const Button: React.FC<ButtonProps> = ({
  emphasis = 'Primary',
  size = 'Regular',
  iconLeft = false,
  iconRight = false,
  state = 'Normal',
  deletable = false,
  label,
  className,
  ...props
}) => {
  const formatClass = (value: string) => value.toLowerCase().replace(/ /g, '_');
  const isDisabled = state === 'Disabled';

  const buttonClassName = clsx(
    styles.button,
    styles[`emphasis_${formatClass(emphasis)}`],
    styles[`size_${formatClass(size)}`],
    styles[`state_${formatClass(state)}`],
    {
      [styles.icon_left]: iconLeft,
      [styles.icon_right]: iconRight,
      [styles.deletable]: deletable,
    },
    className
  );

  return (
    <button
      className={buttonClassName}
      disabled={isDisabled}
      {...props}
    >
      {iconLeft && <IconPlaceholder />}
      <span className={styles.label}>{label}</span>
      {(iconRight || deletable) && <IconPlaceholder />}
    </button>
  );
};

export default Button;