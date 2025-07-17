import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ admin, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/Admin", label: "Dashboard" },
    { to: "/Admin/Users", label: "Users" },
    { to: "/Admin/Stories", label: "Stories" },
    { to: "/Admin/Comments", label: "Comments" },
  ];

  const getLinkClasses = (path) =>
    `w-full text-center px-3 py-2 rounded-lg transition-colors duration-200 text-base font-medium ${
      location.pathname === path
        ? 'bg-indigo-100 text-indigo-900 font-bold'
        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-[60px] md:h-screen w-full md:w-64 bg-white shadow-lg z-30 flex flex-col md:justify-between items-center px-4 md:px-0 py-2 md:py-8 transition-all duration-300">
      {/* Top bar for mobile, column for desktop */}
      <div className="flex w-full items-center justify-between md:flex-col md:items-center md:justify-center">
        <div className="font-bold text-lg md:text-2xl text-indigo-900 text-center">Admin</div>
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-2xl"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>
      {/* Navigation */}
      <nav
        className={`flex-col w-full mt-2 md:mt-8 space-y-2 md:space-y-4 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={getLinkClasses(link.to)}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Admin info and logout (show on desktop, or when menu open on mobile) */}
      <div className={`flex-col items-center w-full mt-4 md:mt-0 space-y-2 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
        {admin && (
          <>
            <img
              src={admin.avatar}
              alt="Admin"
              className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border-2 border-indigo-100 mx-auto"
            />
            <div className="text-indigo-900 font-semibold text-center">{admin.name}</div>
          </>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="bg-indigo-100 text-indigo-900 rounded-full px-6 py-2 font-semibold mt-2 hover:bg-indigo-200 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;