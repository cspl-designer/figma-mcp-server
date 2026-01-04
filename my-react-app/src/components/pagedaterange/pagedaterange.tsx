import React from 'react';
import styles from './PageDateRange.module.css';
import { CalendarDateRange } from '../calendardaterange/calendardaterange';

interface PageDateRangeProps {
  className?: string;
  children?: React.ReactNode;
}

export const PageDateRange: React.FC<PageDateRangeProps> = ({ className, children }) => {
  return (
    <div className={`${styles.page_date_range_679953cb} ${className || ''}`}>
      <CalendarDateRange
        status="Default"
        state="Enabled"
        className={styles.calendar___daterange_4479f1b}
      >
        0 dates selected
      </CalendarDateRange>
    </div>
  );
};