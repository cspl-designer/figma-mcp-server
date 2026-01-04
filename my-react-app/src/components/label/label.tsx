import React from 'react';
import styles from './Label.module.css';

interface LabelProps {
  size: 'Medium';
  required: 'False';
  suffixicon: 'False';
  state: 'Enabled';
  className?: string;
  children?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  size,
  required,
  suffixicon,
  state,
  className,
  children,
}) => {
  let rootClassName = '';

  // Construct a signature string from props to match _signature in _known_variants
  // The '|TEXT' suffix is derived from the _signature in the provided layout data.
  const variantSignature = JSON.stringify({
    size,
    required,
    suffixicon,
    state,
  }) + '|TEXT';

  switch (variantSignature) {
    case '{"size":"Medium","required":"False","suffixicon":"False","state":"Enabled"}|TEXT':
      rootClassName = styles.label_4a62a0b4;
      break;
    default:
      // Fallback to the default className if no specific variant matches.
      // In this case, the provided layout data only has one variant,
      // and its className matches the root className.
      rootClassName = styles.label_4a62a0b4;
      break;
  }

  return (
    <div className={`${rootClassName} ${className || ''}`.trim()}>
      <span className={styles.label_text_10ccb376}>
        {children || 'Active'}
      </span>
    </div>
  );
};

export default Label;