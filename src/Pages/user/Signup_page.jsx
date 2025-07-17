import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup_page = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      website: ''
    }
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const socialLinks = Object.entries(formData.socialLinks).reduce((acc, [key, value]) => {
        if (value.trim()) {
          acc[key] = value;
        }
        return acc;
      }, {});
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          bio: formData.bio || '',
          socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined
        }),
      });
      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.username || !formData.email || !formData.password || !formData.confirmPassword)) {
      setError('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f7f6f2]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-indigo-700">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-6 text-base md:text-lg">Join our community of storytellers</p>
        <div className="flex justify-center mb-8 gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base ${step === 1 ? 'bg-indigo-700' : 'bg-gray-300'}`}>1</div>
            <span className={`text-xs font-semibold ${step === 1 ? 'text-indigo-700' : 'text-gray-500'}`}>Account Details</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base ${step === 2 ? 'bg-indigo-700' : 'bg-gray-300'}`}>2</div>
            <span className={`text-xs font-semibold ${step === 2 ? 'text-indigo-700' : 'text-gray-500'}`}>Profile Info</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm font-semibold text-center">{error}</div>
          )}
          {step === 1 ? (
            <>
              <div>
                <label htmlFor="username" className="block mb-1 text-gray-700 font-semibold">Username *</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">Email address *</label>
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
                <label htmlFor="password" className="block mb-1 text-gray-700 font-semibold">Password *</label>
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
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-gray-700 font-semibold">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                />
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3 rounded-lg bg-indigo-700 text-white font-bold text-lg shadow-md hover:bg-indigo-800 transition-colors mt-2"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="bio" className="block mb-1 text-gray-700 font-semibold">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base resize-vertical"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Social Links</label>
                <input
                  name="social.twitter"
                  type="text"
                  placeholder="Twitter URL"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full mb-2 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                />
                <input
                  name="social.instagram"
                  type="text"
                  placeholder="Instagram URL"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full mb-2 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                />
                <input
                  name="social.website"
                  type="text"
                  placeholder="Website URL"
                  value={formData.socialLinks.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold text-lg shadow-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-indigo-700 text-white font-bold text-lg shadow-md hover:bg-indigo-800 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </form>
        <div className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-700 font-bold hover:underline bg-none border-none p-0"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup_page;