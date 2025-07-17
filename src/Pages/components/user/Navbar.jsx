import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/Explore", label: "Explore" },
    { to: "/Write", label: "Write" },
  ];

  const getLinkClasses = (path) =>
    `px-4 py-2 rounded-full font-semibold transition-colors duration-200 text-base md:text-lg mx-1 ${
      location.pathname === path
        ? theme === 'dark'
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-indigo-600 text-white shadow-md'
        : theme === 'dark'
        ? 'text-gray-200 hover:bg-indigo-700 hover:text-white'
        : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
    }`;

  return (
    <header className={`sticky top-0 z-50 w-full shadow-md ${theme === 'dark' ? 'bg-[#181824]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}> 
          <img src="/public/logo.png" alt="Logo" className="h-10 w-10 md:h-14 md:w-14 object-contain mr-2" />
          <span className={`text-2xl md:text-3xl font-extrabold tracking-tight select-none ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>StoryScape</span>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={getLinkClasses(link.to)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Profile/Login/Theme */}
        <div className="hidden md:flex items-center gap-2">
          {user && (
            <button
              onClick={() => navigate('/UserProfile')}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors"
            >
              <img
                src={user.avatar || '/public/logo.png'}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-300"
              />
              <span className="font-semibold text-indigo-700">{user.username || 'Profile'}</span>
            </button>
          )}
          {user && (
            <button
              onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
              className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleTheme}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-xl shadow focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#232336] text-white' : 'bg-indigo-100 text-indigo-700'}`}
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
        {/* Hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-2xl text-indigo-700 dark:text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />
      <nav
        className={`fixed top-0 left-0 w-4/5 max-w-xs h-full bg-white dark:bg-[#232336] shadow-2xl z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img src="/public/logo.png" alt="Logo" className="h-10 w-10 object-contain mr-2" />
            <span className={`text-xl font-extrabold tracking-tight select-none ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>StoryScape</span>
          </div>
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-2xl text-indigo-700 dark:text-white"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-start px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={getLinkClasses(link.to) + ' w-full text-left'}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => { setMenuOpen(false); navigate('/UserProfile'); }}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors w-full"
            >
              <img
                src={user.avatar || '/public/logo.png'}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-indigo-300"
              />
              <span className="font-semibold text-indigo-700">{user.username || 'Profile'}</span>
            </button>
          )}
          {user && (
            <button
              onClick={() => { setMenuOpen(false); localStorage.removeItem('user'); navigate('/login'); }}
              className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors w-full"
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleTheme}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-xl shadow focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#232336] text-white' : 'bg-indigo-100 text-indigo-700'}`}
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;