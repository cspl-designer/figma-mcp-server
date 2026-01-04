import React from 'react';
import styles from './TenentLogo.module.css';

interface TenentLogoProps {
  property1: 'Marker';
  className?: string;
}

const TenentLogo: React.FC<TenentLogoProps> = ({ property1, className }) => {
  return (
    <div className={`${styles.tenent_logo_37883666} ${className || ''}`}>
      {(() => {
        switch (property1) {
          case 'Marker':
            return (
              <div className={styles.marker_logo_1_53abab2f}>
                <div className={styles.vector_678a0d5} />
                <div className={styles.vector_678a0d5} />
                <div className={styles.vector_678a0d5} />
              </div>
            );
          default:
            // Fallback for unknown variants, or if property1 is not provided
            // Given the strict type 'Marker', this case should ideally not be reached.
            // However, providing a default rendering for robustness.
            return (
              <div className={styles.marker_logo_1_53abab2f}>
                <div className={styles.vector_678a0d5} />
                <div className={styles.vector_678a0d5} />
                <div className={styles.vector_678a0d5} />
              </div>
            );
        }
      })()}
    </div>
  );
};

export default TenentLogo;