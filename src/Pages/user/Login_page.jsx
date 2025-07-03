import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import ProfileMenu from '../components/user/ProfileMenu';

const Login_page = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); // Redirect to home or dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        background: '#f7f6f2',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%',
          background: '#fff',
          borderRadius: '15px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            color: '#333',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Welcome Back
          </h2>
          <p style={{ 
            color: '#666',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Sign in to your account
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

            <div>
              <label htmlFor="email" style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: '#666'
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
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ 
                display: 'block',
                marginBottom: '0.5rem',
                color: '#666'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                <label htmlFor="remember-me" style={{ color: '#666', fontSize: '0.875rem' }}>
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: '#2d2540',
                  fontSize: '0.875rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#2d2540',
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3d3550'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2d2540'}
            >
              Sign in
            </button>
          </form>

          <div style={{ 
            marginTop: '2rem',
            textAlign: 'center',
            color: '#666',
            fontSize: '0.875rem'
          }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2d2540',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login_page;
