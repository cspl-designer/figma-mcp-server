import React from 'react';
import styles from './InputText.module.css';

interface InputTextProps {
  className?: string;
  // Props from the component's own definition, matching _known_variants types
  _state?: "Enabled" | "Disabled" | "Error"; // Renamed to _state as it's not directly used in this component's JSX for styling
  required?: "True" | "False"; // Used for conditional rendering of the required icon

  // Specific props for internal text nodes (Rule 1.B: Structured Leaf)
  requiredIconText?: string;
  labelText?: string;
  inputTextPlaceholder?: string; // Represents the text content of the input field
}

export const InputText: React.FC<InputTextProps> = ({
  className,
  _state = "Enabled", // Default to the variant shown in context
  required = "True", // Default to the variant shown in context
  requiredIconText,
  labelText,
  inputTextPlaceholder,
}) => {
  // Default values for text nodes if not provided, based on the layout data
  const defaultRequiredIconText = "star-of-life";
  const defaultLabelText = "Search";
  const defaultInputTextPlaceholder = "Search by filename";

  return (
    <div className={`${styles.input_text_350c7658} ${className || ''}`}>
      <div className={styles.label_container_39d7949d}>
        {/* Render Required Icon only if 'required' prop is "True" */}
        {required === "True" && (
          <span className={styles.required_icon_6ec8e80c}>
            {requiredIconText || defaultRequiredIconText}
          </span>
        )}
        <span className={styles.label_10ccb376}>
          {labelText || defaultLabelText}
        </span>
      </div>
      <div className={styles.input_container_d3ad5b1}>
        {/* This is represented as a TEXT node in the JSON, acting as the input's displayed text/placeholder */}
        <span className={styles.label_10ccb376}>
          {inputTextPlaceholder || defaultInputTextPlaceholder}
        </span>
      </div>
    </div>
  );
};

export default InputText;