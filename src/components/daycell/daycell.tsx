import React from 'react';
import styles from './DayCell.module.css';

interface DayCellProps {
  selectiontype?: 'Normal' | 'Selected' | 'Range' | 'RangeStart' | 'RangeEnd';
  state?: 'Enabled' | 'Disabled' | 'Hover' | 'Focus';
  datetype?: 'Default dates' | 'Other month dates';
  className?: string;
  children?: React.ReactNode;
}

export const DayCell = ({
  selectiontype = 'Normal',
  state = 'Enabled',
  datetype = 'Default dates',
  className,
  children,
}: DayCellProps) => {
  let variantClassName: string;

  // Construct a key from props to determine the correct variant class
  const variantKey = `${selectiontype}-${state}-${datetype}`;

  switch (variantKey) {
    case 'Normal-Enabled-Default dates':
      variantClassName = styles.day_cell_400b9d95;
      break;
    default:
      // Fallback to the default variant's class name if no specific match
      variantClassName = styles.day_cell_400b9d95;
      break;
  }

  return (
    <div className={`${variantClassName} ${className || ''}`}>
      <span className={styles.day_44608e89}>
        {children || '12'}
      </span>
    </div>
  );
};