import * as React from 'react';
import styles from './pagedaterange.module.css';
import { CalendarDateRange } from '../calendardaterange/calendardaterange';

interface PageDateRangeProps {
  className?: string;
  children?: React.ReactNode;
}

export const PageDateRange: React.FC<PageDateRangeProps> = ({ className }) => {
  return (
    <div className={`${styles.page_date_range_679953cb} ${className || ''}`}>
      <CalendarDateRange
        className={styles.calendar___daterange_4479f1b}
        status="Default"
        state="Enabled"
      >
        {"0 dates selected"}
      </CalendarDateRange>
    </div>
  );
};

export default PageDateRange;