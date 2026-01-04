import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  size: "Regular";
  iconleft: "True" | "False";
  iconright: "True" | "False";
  emphasis: "Primary" | "Secondary" | "Tertiary";
  state: "Normal";
  deletable: "False";
  className?: string;
  children?: React.ReactNode; // Main button text content
  iconText?: string; // Text content for the icon
}

export const Button: React.FC<ButtonProps> = ({
  size,
  iconleft,
  iconright,
  emphasis,
  state,
  deletable,
  className,
  children,
  iconText,
}) => {
  let rootClassName = '';
  const variantKey = `${size}-${iconleft}-${iconright}-${emphasis}-${state}-${deletable}`;

  switch (variantKey) {
    case 'Regular-False-False-Secondary-Normal-False':
      rootClassName = styles.button_e12a434;
      break;
    case 'Regular-False-False-Primary-Normal-False':
      rootClassName = styles.button_575fe6e6;
      break;
    case 'Regular-True-False-Tertiary-Normal-False':
      rootClassName = styles.button_6f79d925;
      break;
    default:
      // Fallback to the current instance's class if no specific variant matches
      rootClassName = styles.button_6f79d925;
      break;
  }

  return (
    <div className={`${rootClassName} ${className || ''}`}>
      {iconleft === "True" && iconText && (
        <span className={styles.check_7ce7f222}>{iconText}</span>
      )}
      {iconleft === "True" && (
        <div className={styles.frame_1000003627_26a05b19}>
          <span className={styles.button_73ce4333}>{children}</span>
        </div>
      )}
      {iconleft === "False" && (
        <span
          className={
            emphasis === "Primary"
              ? styles.button_text_68700fff
              : styles.button_73ce4333
          }
        >
          {children}
        </span>
      )}
    </div>
  );
};

export default Button;