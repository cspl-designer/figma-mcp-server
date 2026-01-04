import React from 'react';
import styles from './DayCell.module.css';

interface DayCellProps {
  selectiontype?: string;
  state?: string;
  datetype?: string;
  children?: React.ReactNode;
  className?: string;
}

// Map of variant signatures to their corresponding CSS class names.
// This is derived from the _known_variants in the layout data.
const variantClassMap = {
  '{"selectiontype":"Normal","state":"Enabled","datetype":"Default dates"}': styles.day_cell_400b9d95,
} as const;

export const DayCell: React.FC<DayCellProps> = ({
  selectiontype = "Normal", // Default value from layout data props
  state = "Enabled",        // Default value from layout data props
  datetype = "Default dates", // Default value from layout data props
  children,
  className,
}) => {
  // Construct a key from the current props to look up the variant class.
  const currentVariantKey = JSON.stringify({ selectiontype, state, datetype });

  // Determine the root class name based on the variant.
  // Fallback to the default class if the specific variant key is not found.
  const rootClassName = variantClassMap[currentVariantKey as keyof typeof variantClassMap] || styles.day_cell_400b9d95;

  return (
    <div className={`${rootClassName} ${className || ''}`}>
      {/* The 'Day' text node */}
      <span className={styles.day_44608e89}>
        {children} {/* Rule 1.A: Use children, provide default text */}
      </span>
    </div>
  );
};

export default DayCell;