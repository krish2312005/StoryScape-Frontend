import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f7f6f2]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-indigo-700">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6 text-base md:text-lg">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm font-semibold text-center">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700 font-semibold">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-1 gap-2">
            <div className="flex items-center gap-2">
              <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 rounded border border-gray-300" />
              <label htmlFor="remember-me" className="text-gray-600 text-sm">Remember me</label>
            </div>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-indigo-700 hover:underline text-sm font-semibold bg-none border-none p-0"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-full bg-indigo-700 text-white font-bold text-lg shadow-md hover:bg-indigo-800 transition-colors"
          >
            Sign in
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-indigo-700 font-bold hover:underline bg-none border-none p-0"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login_page;
