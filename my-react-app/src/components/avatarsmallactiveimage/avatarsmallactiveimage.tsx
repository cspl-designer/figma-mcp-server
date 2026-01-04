import React from 'react';
import styles from './avatarsmallactiveimage.module.css';

interface ImageProps {
  className?: string;
  iconText?: string;
}

const Image: React.FC<ImageProps> = ({ className, iconText }) => {
  return (
    <div className={`${styles.image_2f28980f} ${className || ''}`}>
      <div className={styles.ellipse_1_678a0d5} />
      <span className={styles.check_circle_48ec16f4}>
        {iconText || "check-circle"}
      </span>
    </div>
  );
};

export default Image;