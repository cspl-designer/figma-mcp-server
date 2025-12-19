import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import styles from './payrollfile.module.css';

// Importing required components
import InputText from '../components/InputText/InputText';
import Select from '../components/Select/Select';
import Selector from '../components/Selector/Selector';
import Button from '../components/Button/Button';

// Mock data for Select and Selector
const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Processed', value: 'Processed' },
  { label: 'Error', value: 'Error' },
];

const activeOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

interface FilterFormData {
  filename: string;
  status: string;
  active: 'Yes' | 'No' | null;
}

// Helper component for rendering data rows (Label/Value pairs)
interface DataRowProps {
  label: string;
  value: string;
  isBold?: boolean;
}

const DataRow: React.FC<DataRowProps> = ({ label, value, isBold = false }) => (
  <div>
    <div className={styles.data_label}>{label}</div>
    <div className={isBold ? styles.data_value_bold : styles.data_value}>{value}</div>
  </div>
);

const payrollfilePage = () => {
  const [formData, setFormData] = useState<FilterFormData>({
    filename: '',
    status: '',
    active: null,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((value: string) => {
    setFormData((prevData) => ({ ...prevData, status: value }));
  }, []);

  const handleSelectorChange = useCallback((value: string) => {
    // Cast value back to specific type if needed, or update state type to string
    const validValue = (value === 'Yes' || value === 'No') ? value : null;
    setFormData((prevData) => ({ ...prevData, active: validValue }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData({
      filename: '',
      status: '',
      active: null,
    });
    console.log('Filters reset.');
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching with filters:', formData);
  }, [formData]);

  return (
    <div className={styles.payroll_page_container}>
      <h1 className={styles.page_header}>Payroll</h1>

      {/* Filter Controls Section */}
      <form onSubmit={handleSearch} className={styles.filter_controls_section}>
        <div className={styles.search_input_wrapper}>
          <InputText
            label="Search"
            name="filename"
            value={formData.filename}
            onChange={handleChange}
            placeholder="Search by filename"
          />
        </div>

        <div className={styles.status_select_wrapper}>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleSelectChange} // Use specific handler
            options={statusOptions}
            placeholder="Select"
          />
        </div>

        <div className={styles.active_selector_wrapper}>
          <Selector
            label="Active"
            options={activeOptions}
            value={formData.active || ''} // Handle null
            onChange={handleSelectorChange}
          />
        </div>

        <div className={styles.action_buttons_group}>
          <Button
            emphasis="Tertiary"
            size="Regular"
            state="Normal"
            label="Reset"
            onClick={handleReset}
            type="button"
          />
          <Button
            emphasis="Primary"
            size="Regular"
            state="Normal"
            label="Search"
            type="submit"
          />
        </div>
      </form>

      {/* Data List Section */}
      <div className={styles.data_list_section}>
        {/* Single Payroll Item Card (Error State) */}
        <div className={styles.payroll_item_card}>

          {/* Column 1: File Name & Details */}
          <div className={clsx(styles.column_group, styles.file_details_group)}>
            <div className={styles.file_name_row}>
              <span className={styles.ftp_tag}>FTP</span>
              <div className={styles.data_value_bold}>payroll_file_2024_Q3_...</div>
            </div>
            {/* The visual structure implies the file name is the primary item, followed by date/description */}
            <DataRow label="Upload Date/Time" value="06/24/2021 10:30 AM" />
            <DataRow label="Short Description" value="Q3 2024 Payroll Run" />
          </div>

          {/* Column 2: Company & Plans */}
          <div className={clsx(styles.column_group, styles.company_details_group)}>
            <DataRow label="Company" value="Galileo" isBold />
            <DataRow label="Plan Type" value="Multiple plans" />
            <DataRow label="Group Name" value="Complex" />
          </div>

          {/* Column 3: Profile & Payroll */}
          <div className={clsx(styles.column_group, styles.profile_details_group)}>
            <DataRow label="Profile Name" value="Metlife 401k..." />
            <DataRow label="Payroll Date" value="06/24/2021" />
            <DataRow label="Frequency" value="Monthly" />
          </div>

          {/* Column 4: Payroll Amount */}
          <div className={clsx(styles.column_group, styles.amount_group)}>
            <DataRow label="Payroll Amount" value="" />
            <div className={styles.amount_value}>$ 45678.78</div>
          </div>

          {/* Column 5: Status & Action (Critical) */}
          <div className={clsx(styles.column_group, styles.status_action_group)}>
            <div className={styles.status_action_content}>
              <DataRow label="Status" value="" />
              <div className={styles.status_text}>Error corrections required</div>
              <div className={styles.error_warning_counts}>
                <div className={styles.count_item}>14 Warning</div>
                <div className={styles.count_item}>18 Error</div>
              </div>
            </div>
            <div className={styles.delete_icon_wrapper}>
              {/* Placeholder for Trash Icon, styled to match subtle text color */}
              <span style={{ color: 'var(--text-subtleleast)', cursor: 'pointer' }}>[Trash Icon]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default payrollfilePage;