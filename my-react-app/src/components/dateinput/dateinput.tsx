import React from 'react';
import styles from './DateInput.module.css';

interface DateInputProps {
  className?: string;
  label?: string;
  value?: string;
  filled?: "True" | "False";
}

export const DateInput: React.FC<DateInputProps> = ({
  className,
  label,
  value,
  filled = "False", // Default based on the provided layout data
}) => {
  let rootClassName = '';

  // Handle variants for the root element's class name
  switch (filled) {
    case "False":
      rootClassName = styles.date_input_7fa56797;
      break;
    // Add cases for other 'filled' states if they exist in _known_variants
    // For example:
    // case "True":
    //   rootClassName = styles.date_input_filled_true_class;
    //   break;
    default:
      // Fallback to the default state's class if an unknown 'filled' value is provided
      rootClassName = styles.date_input_7fa56797;
      break;
  }

  return (
    <div className={`${rootClassName} ${className || ''}`}>
      <span className={styles.text_698cbe93}>{label || "From "}</span>
      <span className={styles.text_3b0526dd}>{value || "MM/DD/YYYY"}</span>
    </div>
  );
};

export default DateInput;