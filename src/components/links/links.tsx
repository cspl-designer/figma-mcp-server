import React from 'react';
import styles from './Links.module.css';

interface LinksProps {
  className?: string;
  children?: React.ReactNode;
  size?: "medium";
  underlined?: "True";
  state?: "Active";
  prefixicon?: "False";
  suffixicon?: "False";
  theme?: "Light";
}

export const Links = ({
  className,
  children,
  // Destructure props, their styling effect is handled by the pre-generated CSS classes
  // and the root className which corresponds to the specific variant.
  _size,
  _underlined,
  _state,
  _prefixicon,
  _suffixicon,
  _theme,
}: LinksProps) => {
  return (
    <div className={`${styles.links_4f734dde} ${className || ''}`}>
      <div className={styles.link_container_20075c8b}>
        <div className={styles.link_text_6d488e02}>
          {children || "July"}
        </div>
      </div>
    </div>
  );
};