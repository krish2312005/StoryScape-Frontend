import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleProfileClick = () => {
    navigate('/UserProfile');
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  return (
    <div style={{ position: 'absolute', right: '2rem', top: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button 
        onClick={handleProfileClick}
        style={{ 
          background: theme === 'dark' ? '#232336' : '#2d2540', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '2rem', 
          padding: '0.5rem 1.5rem', 
          fontWeight: 600, 
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = theme === 'dark' ? '#35355a' : '#3d3550'}
        onMouseOut={(e) => e.target.style.backgroundColor = theme === 'dark' ? '#232336' : '#2d2540'}
      >
        Profile
      </button>
      <button 
        onClick={handleLogout}
        style={{ 
          background: '#dc3545', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '2rem', 
          padding: '0.5rem 1.5rem', 
          fontWeight: 600, 
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
      >
        Logout
      </button>
      <button
        onClick={toggleTheme}
        style={{
          background: theme === 'dark' ? '#232336' : '#edeaf3',
          color: theme === 'dark' ? '#fff' : '#2d2540',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          cursor: 'pointer',
          fontSize: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
        }}
        aria-label="Toggle dark/light mode"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default ProfileMenu;