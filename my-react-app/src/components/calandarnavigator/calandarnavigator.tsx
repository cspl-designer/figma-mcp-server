import React from 'react';
import styles from './CalandarNavigator.module.css';
import { Links } from '../links/links';

interface CalandarNavigatorProps {
  property1: 'Default';
  className?: string;
  children?: React.ReactNode;
}

export const CalandarNavigator: React.FC<CalandarNavigatorProps> = ({
  property1,
  className,
}) => {
  switch (property1) {
    case 'Default':
      return (
        <div className={`${styles.calandar_navigator_eefff15} ${className}`}>
          <div className={styles.frame_816715_75b74deb}>
            <div className={styles.icon_2bc55c99}>
              <span className={styles.chevron_left_563bd6c8}>chevron-left</span>
            </div>
          </div>
          <div className={styles.frame_816691_2148eec}>
            <div className={styles.frame_816733_1960c4f9}>
              <Links
                size="medium"
                underlined="True"
                state="Active"
                prefixicon="False"
                suffixicon="False"
                theme="Light"
                className={styles.links_4f734dde}
              >
                July
              </Links>
            </div>
            <div className={styles.frame_816733_1960c4f9}>
              <Links
                size="medium"
                underlined="True"
                state="Active"
                prefixicon="False"
                suffixicon="False"
                theme="Light"
                className={styles.links_4f807ca1}
              >
                2024
              </Links>
            </div>
          </div>
          <div className={styles.frame_816715_75b74deb}>
            <div className={styles.icon_2bc55c99}>
              <span className={styles.chevron_left_563bd6c8}>chevron-right</span>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className={`${styles.calandar_navigator_eefff15} ${className}`}>
          {/* Default content or an empty state if no variant matches */}
        </div>
      );
  }
};