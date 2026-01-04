import React from 'react';
import styles from './calendardaterange.css';
import { AssistiveTexts } from '../assistivetexts/assistivetexts';
import { Button } from '../button/button';
import { Calendersidemenu } from '../calendersidemenu/calendersidemenu';
import { Dateinput } from '../dateinput/dateinput';
import { Calandar } from '../calandar/calandar';

interface CalendarDateRangeProps {
  className?: string;
  children?: React.ReactNode;
  status?: 'Default';
  state?: 'Enabled';
}

export const CalendarDateRange = ({
  className,
  children,
  status = 'Default',
  state = 'Enabled',
}: CalendarDateRangeProps) => {
  // The provided layout data corresponds to the "Default" status and "Enabled" state variant.
  // If other variants were provided with different structures, a switch/case would be used here.

  return (
    <div className={[styles.calendar___daterange_5163e54d, className].filter(Boolean).join(' ')}>
      <div className={styles.header_fce36f8}>
        <div className={styles.title_erapper_35fbfad9}>
          <div className={styles.select_date_range_7b130285}>
            {children || "Select Date Range"}
          </div>
          <AssistiveTexts
            className={styles.assistivetexts_37e9b526}
            state="Info"
            size="Medium"
            theme="Light"
          >
            {"0 dates selected"}
          </AssistiveTexts>
        </div>
        <div className={styles.actions_34b30789}>
          <Button
            className={styles.button_1cd50b61}
            size="Small"
            iconleft={false}
            iconright={false}
            emphasis="Tertiary"
            state="Normal"
            deletable={false}
          >
            {"Cancel"}
          </Button>
          <Button
            className={styles.button_32b55cee}
            size="Small"
            iconleft={false}
            iconright={false}
            emphasis="Secondary"
            state="Disabled"
            deletable={false}
          >
            {"Apply"}
          </Button>
        </div>
      </div>
      <div className={styles.body_wrapper_40bd27d5}>
        <Calendersidemenu
          className={styles.calender_side_menu_16d5f722}
          property1="Calender side menu"
        >
          {"Last 07 days"}
        </Calendersidemenu>
        <div className={styles.from_side_42e9fda2}>
          <Dateinput
            className={styles.date_input_7fa56797}
            filled={false}
          >
            {"From"}
          </Dateinput>
          <Calandar
            className={styles.calandar_4a7987bf}
            type="DisplayDays"
          >
            {"chevron-left"}
          </Calandar>
        </div>
        <div className={styles.to_side_52676260}>
          <Dateinput
            className={styles.date_input_7fa56797}
            filled={false}
          >
            {"From"}
          </Dateinput>
          <Calandar
            className={styles.calandar_4a7987bf}
            type="DisplayDays"
          >
            {"chevron-left"}
          </Calandar>
        </div>
      </div>
    </div>
  );
};