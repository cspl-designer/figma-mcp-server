import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './newloginpage.module.css';

// Component Imports
import InputText from '../components/InputText/InputText';
import InputPassword from '../components/InputPassword/InputPassword';
import Button from '../components/Button/Button';

// Define the type for form data
interface FormData {
  username: string;
  password: string;
}

const NewloginpagePage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    // Clear general error message when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Both Username and Password are required.');
    } else {
      setError('');
      console.log('Login submitted:', formData);
      alert(`Attempting login for ${formData.username}`);
    }
  };

  // Helper function to determine if a specific field has an error
  const getFieldError = (fieldName: keyof FormData) => {
    // Only show error if the general error state is set AND the specific field is empty
    return error && !formData[fieldName] ? 'This field is required.' : undefined;
  };

  const handleCancel = () => {
    setFormData({ username: '', password: '' });
    setError('');
  };

  return (
    <div className={styles.newloginpage_container}>
      
      {/* Header Section (Dark Blue Background) */}
      <div className={styles.header}>
        <div className={styles.header_title}>
          Welcome
        </div>
        <div className={styles.header_subtitle}>
          Login To Access The Portal
        </div>
      </div>

      {/* Content Area (Centers the form card) */}
      <div className={styles.content_area}>
        
        {/* Login Form Card */}
        <form onSubmit={handleSubmit} className={styles.login_form}>
          
          <div className={styles.form_title}>
            Login
          </div>

          {/* Input Group */}
          <div className={styles.input_group}>
            <InputText
              label="*Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email / Phone"
              error={getFieldError('username')}
            />
            <InputPassword
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="your password"
              error={getFieldError('password')}
            />
          </div>

          {/* Button Group */}
          <div className={styles.button_group}>
            <Button
              emphasis="Primary"
              size="Regular"
              label="Login"
              type="submit"
              className={clsx(styles.login_button)} 
            />
            <Button
              emphasis="Secondary"
              size="Regular"
              label="Cancel"
              type="button"
              className={clsx(styles.cancel_button)}
              onClick={handleCancel}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewloginpagePage;