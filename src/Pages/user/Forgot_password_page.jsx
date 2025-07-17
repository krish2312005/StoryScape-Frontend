import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 md:p-10 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
        <h2 className={`text-2xl md:text-3xl font-extrabold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Forgot Password</h2>
        <p className={`text-center mb-6 text-base md:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Enter your email and new password</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm font-semibold text-center">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-sm font-semibold text-center">{success}</div>
          )}
          <div>
            <label htmlFor="email" className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base ${theme === 'dark' ? 'bg-[#232336] text-white border-[#444]' : 'bg-white text-indigo-900 border-gray-200'}`}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={`block mb-1 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base ${theme === 'dark' ? 'bg-[#232336] text-white border-[#444]' : 'bg-white text-indigo-900 border-gray-200'}`}
            />
          </div>
          <button
            type="submit"
            className={`mt-4 w-full py-3 rounded-full font-bold text-lg shadow-md transition-colors ${theme === 'dark' ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-indigo-700 text-white hover:bg-indigo-800'}`}
          >
            Reset Password
          </button>
        </form>
        <div className={`mt-6 text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Remembered your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className={`font-bold hover:underline bg-none border-none p-0 ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forgot_password_page;
