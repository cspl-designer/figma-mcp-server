import React from 'react';
import styles from './calandar.module.css';
import { CalandarNavigator } from '../calandarnavigator/calandarnavigator';
import { DayCell } from '../daycell/daycell';

interface CalandarProps {
  type: 'DisplayDays';
  className?: string;
  children?: React.ReactNode;
}

export const Calandar = ({ type, className, children }: CalandarProps) => {
  switch (type) {
    case 'DisplayDays':
      // Data for day names, extracted from the layout data
      const dayNames = [
        { text: 'Sun' },
        { text: 'Mon' },
        { text: 'Tue' },
        { text: 'Wed' },
        { text: 'Thu' },
        { text: 'Fri' },
        { text: 'Sat' },
      ] as const;

      // Data for day cells, extracted from the layout data
      const dayCellsData = [
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '12' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '1' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '2' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '3' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '4' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '5' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '6' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '7' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '8' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '9' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '10' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '11' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '12' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '13' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '14' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '15' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '16' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '17' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '18' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '19' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '20' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '21' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '22' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '23' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '24' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '25' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '26' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '27' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '28' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '29' },
        { selectiontype: 'Normal', state: 'Enabled', datetype: 'Default dates', children: '30' },
      ] as const;

      return (
        <div className={[styles.calandar_4a7987bf, className].filter(Boolean).join(' ')}>
          <CalandarNavigator
            property1="Default"
            className={styles.calandar_navigator_eefff15}
          >
            chevron-left
          </CalandarNavigator>
          <div className={styles.displaygrid_5db2805a}>
            <div className={styles.day_name_28f243c9}>
              {dayNames.map((day, index) => (
                <div key={index} className={styles.sun_575bf373}>
                  {day.text}
                </div>
              ))}
            </div>
            <div className={styles.days_grid_177ac34d}>
              {dayCellsData.map((cell, index) => (
                <DayCell
                  key={index}
                  selectiontype={cell.selectiontype}
                  state={cell.state}
                  datetype={cell.datetype}
                  className={styles.day_cell_400b9d95}
                >
                  {cell.children}
                </DayCell>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      // Fallback for unknown types or if children are passed directly to the root
      return <div className={className}>{children}</div>;
  }
};