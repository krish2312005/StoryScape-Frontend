import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const getLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? (theme === 'dark' ? '#fff' : '#333') : (theme === 'dark' ? '#bbb' : '#666'),
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    borderBottom: location.pathname === path ? `2px solid ${theme === 'dark' ? '#fff' : '#333'}` : 'none',
    padding: '0.5rem 0',
    transition: 'all 0.3s ease'
  });

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem 0 1rem 0', 
      background: theme === 'dark' ? '#181824' : '#f7f6f2', 
      gap: '2rem', 
      position: 'relative' 
    }}>
      <div style={{ position: 'absolute', left: '2rem', fontSize: '2rem' }}>
        <img style={{ height: '100px'}} src="/logo.png" alt="" />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={getLinkStyle('/')}>Home</Link>
        <Link to="/Explore" style={getLinkStyle('/Explore')}>Explore</Link>
        <Link to="/Write" style={getLinkStyle('/Write')}>Write</Link>
      </div>
    </nav>
  );
};

export default Navbar;