import React from 'react';
import styles from './PayrollIcons.module.css';

interface PayrollIconsProps {
  className?: string;
  children?: React.ReactNode;
  property1?: "Default";
}

export const PayrollIcons = ({
  className,
  children,
  property1 = "Default",
}: PayrollIconsProps) => {
  switch (property1) {
    case "Default":
    default:
      return (
        <div className={`${styles.payroll_icons_70df3668} ${className || ''}`}>
          <div className={styles.payroll_icons_70df3668}>
            <div className={styles.vector_678a0d5}></div>
            <span className={styles.ftp_1f19c342}>{children || "FTP"}</span>
          </div>
        </div>
      );
  }
};