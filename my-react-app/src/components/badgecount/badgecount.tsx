import React from 'react';
import styles from './BadgeCount.module.css';

interface BadgeCountProps {
  type: "Critical";
  filled: "True";
  children?: React.ReactNode;
  className?: string;
}

const BadgeCount: React.FC<BadgeCountProps> = ({
  type,
  filled,
  children,
  className,
}) => {
  let variantClassName = '';

  // Determine the base class name based on the component's variants
  // The _signature from _known_variants is "{\"type\":\"Critical\",\"filled\":\"True\"}|TEXT"
  // We combine 'type' and 'filled' to match this signature pattern.
  switch (`${type}|${filled}`) {
    case 'Critical|True':
      // This class name is derived from the _known_variants entry for this specific variant.
      variantClassName = styles.badge___count_384fc96b;
      break;
    default:
      // Fallback for any variant combination not explicitly handled.
      // In this case, the layout data only provides one variant, so we use its class as a default.
      variantClassName = styles.badge___count_384fc96b;
      break;
  }

  return (
    <div className={`${variantClassName} ${className || ''}`.trim()}>
      <span className={styles.number_56375605}>
        {children || "+25"}
      </span>
    </div>
  );
};

export default BadgeCount;