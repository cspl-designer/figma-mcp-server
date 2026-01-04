import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  size: "Small";
  iconleft: "False";
  iconright: "False";
  emphasis: "Tertiary" | "Secondary";
  state: "Normal" | "Disabled";
  deletable: "False";
  className?: string;
  children?: React.ReactNode;
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
}) => {
  const currentProps = { size, iconleft, iconright, emphasis, state, deletable };
  const propsKey = JSON.stringify(currentProps);

  switch (propsKey) {
    case '{"size":"Small","iconleft":"False","iconright":"False","emphasis":"Tertiary","state":"Normal","deletable":"False"}':
      return (
        <div className={`${styles.button_1cd50b61} ${className || ''}`}>
          <div className={styles.frame_1000003627_5305f5d1}>
            <span className={styles.button_446e7135}>
              {children || "Cancel"}
            </span>
          </div>
        </div>
      );
    case '{"size":"Small","iconleft":"False","iconright":"False","emphasis":"Secondary","state":"Disabled","deletable":"False"}':
      return (
        <div className={`${styles.button_32b55cee} ${className || ''}`}>
          <span className={styles.button_34c76446}>
            {children || "Apply"}
          </span>
        </div>
      );
    default:
      // Default case matches the current instance provided in the layout data.
      return (
        <div className={`${styles.button_32b55cee} ${className || ''}`}>
          <span className={styles.button_34c76446}>
            {children || "Apply"}
          </span>
        </div>
      );
  }
};