
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';


const Navbar = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navBg = theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]';
  const activeLink = theme === 'dark' ? 'text-white border-b-2 border-white font-bold' : 'text-[#333] border-b-2 border-[#333] font-bold';
  const inactiveLink = theme === 'dark' ? 'text-[#bbb]' : 'text-[#666]';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/Explore', label: 'Explore' },
    { to: '/Write', label: 'Write' },
  ];

  return (
    <nav className={`w-full ${navBg} px-4 py-3 flex items-center justify-between relative z-50`}>
      {/* Logo */}
      <div className="flex items-center">
        <img className="h-12 w-auto sm:h-16" src="/logo.png" alt="Logo" />
      </div>

      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center h-10 w-10 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 mb-1 rounded bg-gray-700 dark:bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 mb-1 rounded bg-gray-700 dark:bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 rounded bg-gray-700 dark:bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Links */}
      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`no-underline px-2 py-1 transition-all duration-300 ${location.pathname === link.to ? activeLink : inactiveLink}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`absolute top-full left-0 w-full ${navBg} flex flex-col items-center gap-4 py-4 shadow-lg md:hidden animate-fade-in z-40`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`no-underline px-2 py-2 w-full text-center transition-all duration-300 ${location.pathname === link.to ? activeLink : inactiveLink}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;