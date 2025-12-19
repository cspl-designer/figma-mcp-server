import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Filepage.module.css';

// Available Components
import InputText from '../components/InputText/InputText';
import Select from '../components/Select/Select';
import Selector from '../components/Selector/Selector';
import Button from '../components/Button/Button';

// --- Mock Data ---

interface FileData {
  id: string;
  title: string;
  category: string;
  type: string;
  status: string;
  logo: string;
}

const mockFiles: FileData[] = [
  { id: '124542', title: 'Plan Simple Regular funding...', category: 'Regular', type: '401(k)', status: 'Active', logo: 'thomann - MUSIC IS OUR PASSION' },
  { id: '124543', title: 'Plan Complex Annual review...', category: 'Annual', type: '403(b)', status: 'Active', logo: 'thomann - MUSIC IS OUR PASSION' },
];

const statusOptions = [
  { label: 'Select', value: 'Select' },
  { label: 'Active', value: 'Active' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Archived', value: 'Archived' },
];

const activeOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

// --- Component Definition ---

const FilepagePage = () => {
  const [formData, setFormData] = useState({
    searchQuery: '',
    statusFilter: 'Select',
    activeFilter: 'Yes',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, statusFilter: value }));
  };

  const handleActiveFilterChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, activeFilter: value }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', formData);
    // In a real application, this would trigger an API call
  };

  const handleReset = () => {
    setFormData({
      searchQuery: '',
      statusFilter: 'Select',
      activeFilter: 'Yes',
    });
    console.log('Filters reset.');
  };

  const FileCard: React.FC<{ file: FileData }> = ({ file }) => (
    <div className={clsx(styles.file_card)}>
      <h3 className={clsx(styles.card_title)}>{file.title}</h3>

      <div className={clsx(styles.metadata_row)}>
        <div className={clsx(styles.metadata_item)}>
          <span className={clsx(styles.metadata_label)}>ID</span>
          <span className={clsx(styles.metadata_value)}>{file.id}</span>
        </div>
        <div className={clsx(styles.metadata_item)}>
          <span className={clsx(styles.metadata_label)}>Category</span>
          <span className={clsx(styles.metadata_value)}>{file.category}</span>
        </div>
        <div className={clsx(styles.metadata_item)}>
          <span className={clsx(styles.metadata_label)}>Type</span>
          <span className={clsx(styles.metadata_value)}>{file.type}</span>
        </div>
      </div>

      <div className={clsx(styles.card_footer)}>
        <div className={clsx(styles.status_indicator)}>
          <div className={clsx(styles.status_bar)} />
          <div className={clsx(styles.status_text_group)}>
            <span className={clsx(styles.status_label)}>Status</span>
            <span className={clsx(styles.status_value)}>{file.status}</span>
          </div>
        </div>
        <span className={clsx(styles.logo_text)}>{file.logo}</span>
      </div>
    </div>
  );

  return (
    <div className={clsx(styles.filepage_container)}>
      <h1 className={clsx(styles.page_title)}>Files</h1>

      <div className={clsx(styles.search_filter_bar)}>
        {/* Search Input */}
        <div className={clsx(styles.search_input_wrapper)}>
          <InputText
            label="Search"
            name="searchQuery"
            value={formData.searchQuery}
            onChange={handleChange}
            placeholder="Search by name"
          />
        </div>

        {/* Status Filter */}
        <div className={clsx(styles.status_filter_wrapper)}>
          <Select
            label="Status"
            name="statusFilter"
            value={formData.statusFilter}
            onChange={handleSelectChange}
            options={statusOptions}
          />
        </div>

        {/* Active Filter (Selector) */}
        <Selector
          label="Active"
          options={activeOptions}
          value={formData.activeFilter}
          onChange={handleActiveFilterChange}
        />

        {/* Action Buttons */}
        <div className={clsx(styles.action_buttons_group)}>
          <Button
            emphasis="Tertiary"
            size="Regular"
            state="Normal"
            label="Reset"
            onClick={handleReset}
          />
          <Button
            emphasis="Primary"
            size="Regular"
            state="Normal"
            label="Search"
            onClick={handleSearch}
          />
        </div>
      </div>

      <div className={clsx(styles.separator)} />

      <div className={clsx(styles.content_grid)}>
        {mockFiles.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FilepagePage;
