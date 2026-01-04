import React from 'react';
import styles from './AssistiveTexts.module.css';

interface AssistiveTextsProps {
  state: "Info" | "Error" | "Success" | "Warning"; // Based on common patterns, but only "Info" is explicitly shown in context
  size: "Medium" | "Small"; // Only "Medium" is explicitly shown in context
  theme: "Light" | "Dark"; // Only "Light" is explicitly shown in context
  label: string;
  className?: string;
}

const AssistiveTexts: React.FC<AssistiveTextsProps> = ({
  state,
  size: _size, // Renamed to _size as it's not used in the current logic based on provided variants
  theme: _theme, // Renamed to _theme as it's not used in the current logic based on provided variants
  label,
  className,
}) => {
  let iconContent: string;

  // Polymorphic rule: Handle variants via switch/case for the 'state' prop
  switch (state) {
    case "Info":
      iconContent = "info-circle";
      break;
    // Add other cases here if more variants for 'state' are provided in _known_variants
    // For example:
    // case "Error":
    //   iconContent = "exclamation-circle";
    //   break;
    // case "Success":
    //   iconContent = "check-circle";
    //   break;
    // case "Warning":
    //   iconContent = "exclamation-triangle";
    //   break;
    default:
      // Default case for state, using the icon from the provided "Info" variant
      iconContent = "info-circle";
      break;
  }

  return (
    <div className={className ? `${styles.assistivetexts_37e9b526} ${className}` : styles.assistivetexts_37e9b526}>
      <div className={styles.base___icon_3dd087a6}>
        <div className={styles.info_circle_3bc70078}>{iconContent}</div>
      </div>
      <div className={styles.base_label____label__6108663a}>
        <div className={styles.error___input_must_also_use_error_state_10ccb376}>{label}</div>
      </div>
    </div>
  );
};

export default AssistiveTexts;