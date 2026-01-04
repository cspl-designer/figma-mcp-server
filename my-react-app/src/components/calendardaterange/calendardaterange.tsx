import React from 'react';
import styles from './CalendarDateRange.module.css';
import AssistiveTexts from '../assistivetexts/assistivetexts';
import { Button } from '../button/button';
import { CalenderSideMenu } from '../calendersidemenu/calendersidemenu';
import DateInput from '../dateinput/dateinput';
import Calandar from '../calandar/calandar';

export interface CalendarDateRangeProps {
  className?: string;
  status?: "Default";
  state?: "Enabled";
  title?: string;
  assistiveTextContent?: string;
  cancelButtonText?: string;
  applyButtonText?: string;
  sideMenuContent?: string;
  fromDateInputLabel?: string;
  fromCalendarIcon?: string;
  toDateInputLabel?: string;
  toCalendarIcon?: string;
}

export const CalendarDateRange: React.FC<CalendarDateRangeProps> = ({
  className,
  status = "Default",
  state = "Enabled",
  title = "Select Date Range",
  assistiveTextContent = "0 dates selected",
  cancelButtonText = "Cancel",
  applyButtonText = "Apply",
  sideMenuContent = "Last 07 days",
  fromDateInputLabel = "From",
  fromCalendarIcon = "chevron-left",
  toDateInputLabel = "From",
  toCalendarIcon = "chevron-left",
}) => {
  // The provided layout data corresponds to the "Default" status and "Enabled" state variant.
  // No dynamic switch is needed for the root component based on these props,
  // as the structure is already resolved for this specific variant.

  return (
    <div className={`${styles.calendar___daterange_5163e54d} ${className || ""}`}>
      <div className={styles.header_fce36f8}>
        <div className={styles.title_erapper_35fbfad9}>
          <div className={styles.select_date_range_7b130285}>
            {title}
          </div>
          <AssistiveTexts
            className={styles.assistivetexts_37e9b526}
            state="Info"
            size="Medium"
            theme="Light"
          >
            {assistiveTextContent}
          </AssistiveTexts>
        </div>
        <div className={styles.actions_34b30789}>
          <Button
            className={styles.button_1cd50b61}
            size="Small"
            iconleft="False"
            iconright="False"
            emphasis="Tertiary"
            state="Normal"
            deletable="False"
          >
            {cancelButtonText}
          </Button>
          <Button
            className={styles.button_32b55cee}
            size="Small"
            iconleft="False"
            iconright="False"
            emphasis="Secondary"
            state="Disabled"
            deletable="False"
          >
            {applyButtonText}
          </Button>
        </div>
      </div>
      <div className={styles.body_wrapper_40bd27d5}>
        <CalenderSideMenu
          className={styles.calender_side_menu_16d5f722}
          property1="Calender side menu"
        >
          {sideMenuContent}
        </CalenderSideMenu>
        <div className={styles.from_side_42e9fda2}>
          <DateInput
            className={styles.date_input_7fa56797}
            filled="False"
          >
            {fromDateInputLabel}
          </DateInput>
          <Calandar
            className={styles.calandar_4a7987bf}
            type="DisplayDays"
          >
            {fromCalendarIcon}
          </Calandar>
        </div>
        <div className={styles.to_side_52676260}>
          <DateInput
            className={styles.date_input_7fa56797}
            filled="False"
          >
            {toDateInputLabel}
          </DateInput>
          <Calandar
            className={styles.calandar_4a7987bf}
            type="DisplayDays"
          >
            {toCalendarIcon}
          </Calandar>
        </div>
      </div>
    </div>
  );
};

export default CalendarDateRange;