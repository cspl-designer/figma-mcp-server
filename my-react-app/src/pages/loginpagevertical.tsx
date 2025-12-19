import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './loginpagevertical.module.css';

// Component Imports
import InputText from '../components/InputText/InputText';
import InputPassword from '../components/InputPassword/InputPassword';
import Button from '../components/Button/Button';

interface FormData {
  username: string;
  password: string;
}

const LoginpageverticalPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear specific error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Both username and password are required.');
    } else {
      setError('');
      console.log('Login submitted:', formData);
      alert(`Attempting login for ${formData.username}`);
    }
  };

  return (
    <div className={clsx(styles.login_page_container)}>
      {/* Branding Panel (Left Side) */}
      <div className={clsx(styles.branding_panel)}>
        <div className={clsx(styles.welcome_text)}>
          Welcome
        </div>
        <div className={clsx(styles.portal_access_text)}>
          Login To Access The Portal
        </div>
      </div>

      {/* Login Form Container (Right Side) */}
      <div className={clsx(styles.login_form_container)}>
        <div className={clsx(styles.login_title)}>
          Login
        </div>

        <form onSubmit={handleSubmit} className={clsx(styles.form_group)}>
          {/* Username Input */}
          <InputText
            label="Username *"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Email / Phone"
            error={error && !formData.username ? 'Username is required.' : undefined}
          />

          {/* Password Input */}
          <InputPassword
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="your password"
            error={error && !formData.password ? 'Password is required.' : undefined}
          />

          {/* Button Group */}
          <div className={clsx(styles.button_group)}>
            <Button
              emphasis="Secondary"
              size="Regular"
              state="Normal"
              label="Cancel"
              type="button"
              className={clsx(styles.button_cancel)}
              // Note: In a real app, this would handle navigation or form reset
              onClick={() => {
                setFormData({ username: '', password: '' });
                setError('');
              }}
            />
            <Button
              emphasis="Primary"
              size="Regular"
              state="Normal"
              label="Login"
              type="submit"
              className={clsx(styles.button_login)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginpageverticalPage;