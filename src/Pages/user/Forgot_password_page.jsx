import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import { useTheme } from '../../context/ThemeContext';

const Forgot_password_page = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: theme === 'dark' ? '#181824' : '#f7f6f2',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          background: theme === 'dark' ? '#232336' : '#fff',
          borderRadius: '15px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Forgot Password
          </h2>
          <p style={{
            color: theme === 'dark' ? '#bbb' : '#666',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Enter your email and new password
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                background: '#d1fae5',
                border: '1px solid #6ee7b7',
                color: '#047857',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: theme === 'dark' ? '#bbb' : '#666'
              }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  background: theme === 'dark' ? '#232336' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#333'
                }}
              />
            </div>
            <div>
              <label htmlFor="newPassword" style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: theme === 'dark' ? '#bbb' : '#666'
              }}>
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  background: theme === 'dark' ? '#232336' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#333'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: theme === 'dark' ? '#2d2540' : '#2d2540',
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.target.style.backgroundColor = theme === 'dark' ? '#3d3550' : '#3d3550'}
              onMouseOut={e => e.target.style.backgroundColor = theme === 'dark' ? '#2d2540' : '#2d2540'}
            >
              Reset Password
            </button>
          </form>
          <div style={{
            marginTop: '2rem',
            textAlign: 'center',
            color: theme === 'dark' ? '#bbb' : '#666',
            fontSize: '0.875rem'
          }}>
            Remembered your password?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: theme === 'dark' ? '#fff' : '#2d2540',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot_password_page;
