import React from 'react';
import styles from './InlineActionButton.module.css';

interface InlineActionButtonProps {
  /**
   * The status of the action button.
   * @example "Enabled"
   */
  status: 'Enabled'; // Based on the provided _known_variants
  /**
   * The type of action the button represents, determining its icon.
   * @example "Delete"
   */
  type: 'Delete'; // Based on the provided _known_variants
  /**
   * Optional className to apply to the root element.
   */
  className?: string;
}

const InlineActionButton: React.FC<InlineActionButtonProps> = ({
  status,
  type,
  className,
}) => {
  let iconContent: string;
  let iconClassName: string;

  // Polymorphic Rule: Handle variants via switch/case
  // The _known_variants array defines the internal structure based on props.
  // We combine status and type to create a unique key for variant matching.
  const variantKey = `${status}-${type}`;

  switch (variantKey) {
    case 'Enabled-Delete':
      // This matches the single variant provided in the layout data.
      iconContent = 'trash-alt';
      iconClassName = styles.trash_alt_12ed22b4;
      break;
    default:
      // Provide a default fallback, which in this case is the only known variant.
      // If more variants were present, this default would handle unexpected combinations.
      iconContent = 'trash-alt';
      iconClassName = styles.trash_alt_12ed22b4;
      break;
  }

  return (
    <div className={`${styles.inline_action_button_1f482ad8} ${className || ''}`}>
      <span className={iconClassName}>{iconContent}</span>
    </div>
  );
};

export default InlineActionButton;