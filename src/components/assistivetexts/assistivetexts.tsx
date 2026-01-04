import React from 'react';
import styles from './AssistiveTexts.module.css';

interface AssistiveTextsProps {
  state?: 'Info' | 'Error' | 'Success' | 'Warning'; // Prop 'state' from layout data
  size?: 'Small' | 'Medium'; // Prop 'size' from layout data
  theme?: 'Light' | 'Dark'; // Prop 'theme' from layout data
  className?: string;
  children?: React.ReactNode; // Represents the main label text, e.g., "0 dates selected"
  iconContent?: React.ReactNode; // Represents the icon text, e.g., "info-circle"
}

export const AssistiveTexts = ({
  state = 'Info',
  size = 'Medium',
  theme = 'Light',
  className,
  children,
  iconContent,
}: AssistiveTextsProps) => {
  // Default content extracted from the provided JSON for fallbacks
  const defaultLabelText = "0 dates selected";
  const defaultIconText = "info-circle";

  let iconElement: React.ReactNode;
  let labelElement: React.ReactNode;
  let rootVariantClassName: string = styles.assistivetexts_37e9b526; // Default from the provided variant

  // Handle variants using switch/case as per instructions.
  // In this specific context, only one variant ('Info-Medium-Light') is provided in _known_variants.
  // This setup allows for future expansion with different variant structures or class names.
  switch (`${state}-${size}-${theme}`) {
    case 'Info-Medium-Light':
      // Structure for the 'Info-Medium-Light' variant, matching the provided layout data
      iconElement = (
        <div className={styles.base___icon_3dd087a6}>
          <span className={styles.info_circle_3bc70078}>
            {iconContent || defaultIconText}
          </span>
        </div>
      );
      labelElement = (
        <div className={styles.base_label____label__6108663a}>
          <span className={styles.error___input_must_also_use_error_state_10ccb376}>
            {children || defaultLabelText}
          </span>
        </div>
      );
      // The root className for this variant is already set as default
      break;
    default:
      // Default fallback structure if no specific variant matches.
      // This will render the same structure as 'Info-Medium-Light' for now.
      iconElement = (
        <div className={styles.base___icon_3dd087a6}>
          <span className={styles.info_circle_3bc70078}>
            {iconContent || defaultIconText}
          </span>
        </div>
      );
      labelElement = (
        <div className={styles.base_label____label__6108663a}>
          <span className={styles.error___input_must_also_use_error_state_10ccb376}>
            {children || defaultLabelText}
          </span>
        </div>
      );
      break;
  }

  return (
    <div className={`${rootVariantClassName} ${className || ''}`}>
      {iconElement}
      {labelElement}
    </div>
  );
};