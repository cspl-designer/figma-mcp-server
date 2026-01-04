import React from 'react';
import styles from './SelectorElements.module.css';

interface SelectorElementsProps {
  pilltype: "Suffix" | "Prefix";
  status: "None";
  state: "Enabled" | "Active";
  className?: string;
  children?: React.ReactNode;
}

export const SelectorElements: React.FC<SelectorElementsProps> = ({
  pilltype,
  status,
  state,
  className,
  children,
}) => {
  const variantKey = `${pilltype}-${status}-${state}`;

  let content;

  switch (variantKey) {
    case "Prefix-None-Active":
      content = (
        <div className={`${styles.selectorelements_5c3108ad} ${className || ''}`}>
          <div className={styles.prefix_73ce4333}>
            {children}
          </div>
        </div>
      );
      break;
    case "Suffix-None-Enabled":
    default: // This case matches the provided LAYOUT_DATA's current state
      content = (
        <div className={`${styles.selectorelements_3422b6a7} ${className || ''}`}>
          <div className={styles.base_suffix_7eaf6303}>
            <div className={styles.suffix_2e8db5ba}>
              {children}
            </div>
          </div>
        </div>
      );
      break;
  }

  return content;
};

export default SelectorElements;