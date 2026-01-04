import React from 'react';
import styles from './PayrollCardFileUpload.module.css';
import clsx from 'clsx';

import { PayrollIcons } from '../payrollicons/payrollicons';
import InlineActionbutton from '../inlineactionbutton/inlineactionbutton';

interface PayrollCardFileUploadProps {
  className?: string;
  payrollstatus: "Danger"; // Based on the provided _known_variants
}

export const PayrollCardFileUpload: React.FC<PayrollCardFileUploadProps> = ({
  className,
  payrollstatus,
}) => {
  return (
    <div className={clsx(styles.payroll_card___file_upload_6ca2c810, className)}>
      {(() => {
        switch (payrollstatus) {
          case "Danger":
            return (
              <>
                <div className={styles.file_info_378a875f}>
                  <div className={styles.file_details_4180848a}>
                    <div className={styles.file_name_container_5eff3040}>
                      <div className={styles.file_name_label_10ccb376}>File name & details</div>
                      <div className={styles.file_name_82e556}>
                        <PayrollIcons property1="Default" children="FTP" className={styles.payroll_icons_70df3668} />
                        <div className={styles.file_name_text_12e79c3c}>Gregarious Simulation Syst...114108435.xls</div>
                      </div>
                    </div>
                    <div className={styles.file_date_container_13c154a8}>
                      <div className={styles.file_name_label_10ccb376}>5 days ago</div>
                      <div className={styles.line_7_678a0d5}></div>
                      <div className={styles.file_date_details_12257c72}>
                        <div className={styles.file_name_label_10ccb376}>02/01/2021 </div>
                        <div className={styles.file_name_label_10ccb376}>12:30</div>
                      </div>
                    </div>
                    <div className={styles.file_description_60b58e74}>File description goes here and text will be in ellipsis style, full description displayed in payroll...</div>
                  </div>
                  <div className={styles.company_profile_container_31a32b22}>
                    <div className={styles.company_info_4a2ad6eb}>
                      <div className={styles.company_name_container_74161b9b}>
                        <div className={styles.company_label_44608e89}>Company</div>
                        <div className={styles.company_name_128a2945}>Galileo</div>
                      </div>
                      <div className={styles.plan_details_container_49759566}>
                        <div className={styles.company_label_44608e89}>Plan details</div>
                        <div className={styles.plan_details_7b130285}>Multiple plans</div>
                        <div className={styles.group_name_56110500}>Group name : Complex</div>
                      </div>
                    </div>
                    <div className={styles.profile_info_4a363432}>
                      <div className={styles.profile_name_container_742178e2}>
                        <div className={styles.company_label_44608e89}>Profile name</div>
                        <div className={styles.company_name_128a2945}>Metlife ...profile name</div>
                      </div>
                      <div className={styles.payroll_details_container_4980f2ad}>
                        <div className={styles.company_label_44608e89}>Payroll details</div>
                        <div className={styles.company_name_128a2945}>06/24/2021 </div>
                        <div className={styles.payroll_frequency_3da2198a}>Monthly</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.payroll_amount_container_3511bd0}>
                    <div className={styles.file_name_label_10ccb376}>Payroll amount</div>
                    <div className={styles.file_name_text_12e79c3c}>$ 45678.78</div>
                  </div>
                </div>
                <div className={styles.error_container_277b6e57}>
                  <InlineActionbutton status="Enabled" type="Delete" children="trash-alt" className={styles.inline_action_button_1f482ad8} />
                  <div className={styles.error_details_67cc4dc6}>
                    <div className={styles.error_message_249f61b7}>Error corrections required</div>
                    <div className={styles.error_summary_4f096b59}>
                      <div className={styles.file_name_label_10ccb376}>14 Warning</div>
                      <div className={styles.line_7_678a0d5}></div>
                      <div className={styles.file_name_label_10ccb376}>18 Error </div>
                    </div>
                  </div>
                </div>
              </>
            );
          default:
            // This component is currently only defined for the "Danger" payrollstatus.
            // Additional cases would be added here if other variants were provided in _known_variants.
            return null;
        }
      })()}
    </div>
  );
};

export default PayrollCardFileUpload;