import React from 'react';
import styles from './Calandar.module.css';
import { CalandarNavigator } from '../calandarnavigator/calandarnavigator';
import DayCell from '../daycell/daycell';

interface CalandarProps {
  className?: string;
  type: "DisplayDays"; // Based on _known_variants
}

const Calandar: React.FC<CalandarProps> = ({ className, type }) => {
  // The layout data provided corresponds to the "DisplayDays" variant.
  // We use a switch statement to handle different 'type' variants.
  switch (type) {
    case "DisplayDays":
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
      const dayCellsData = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14",
        "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"
      ] as const;

      return (
        <div className={`${styles.calandar_4a7987bf} ${className || ''}`}>
          <CalandarNavigator
            className={styles.calandar_navigator_eefff15}
            property1="Default"
          >
            chevron-left
          </CalandarNavigator>
          <div className={styles.displaygrid_5db2805a}>
            <div className={styles.day_name_28f243c9}>
              {dayNames.map((dayName, index) => (
                <span key={index} className={styles.sun_575bf373}>
                  {dayName}
                </span>
              ))}
            </div>
            <div className={styles.days_grid_177ac34d}>
              {dayCellsData.map((dayNumber, index) => (
                <DayCell
                  key={index}
                  className={styles.day_cell_400b9d95}
                  selectiontype="Normal"
                  state="Enabled"
                  datetype="Default dates"
                >
                  {dayNumber}
                </DayCell>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      // Fallback for unknown 'type' values
      return (
        <div className={`${styles.calandar_4a7987bf} ${className || ''}`}>
          <p>Unknown calendar type: {type}</p>
        </div>
      );
  }
};

export default Calandar;