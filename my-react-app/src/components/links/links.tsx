import React from 'react';
import styles from './Links.module.css';

interface LinksProps {
  className?: string;
  children?: React.ReactNode;
  // Props derived from _known_variants, matching types exactly as strings
  size: "medium";
  underlined: "True";
  state: "Active";
  prefixicon: "False";
  suffixicon: "False";
  theme: "Light";
}

export const Links: React.FC<LinksProps> = ({
  className,
  children,
  size,
  underlined,
  state,
  prefixicon,
  suffixicon,
  theme,
}) => {
  let variantClass = '';

  // Construct a key from the props to match against known variants
  const variantKey = `${size}-${underlined}-${state}-${prefixicon}-${suffixicon}-${theme}`;

  // Handle variants via switch/case as per "Polymorphic Rule"
  switch (variantKey) {
    case 'medium-True-Active-False-False-Light':
      variantClass = styles.links_4f734dde;
      break;
    default:
      // Fallback for any unknown variant combination.
      // In this specific context, we'll default to the provided class.
      variantClass = styles.links_4f734dde;
      break;
  }

  return (
    <div className={`${variantClass} ${className || ''}`}>
      <div className={styles.link_container_20075c8b}>
        <span className={styles.link_text_6d488e02}>
          {children || "Default Link Text"}
        </span>
      </div>
    </div>
  );
};

export default Links;