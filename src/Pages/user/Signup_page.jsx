import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import ProfileMenu from '../components/user/ProfileMenu';

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
      // Filter out empty social links
      const socialLinks = Object.entries(formData.socialLinks).reduce((acc, [key, value]) => {
        if (value.trim()) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          bio: formData.bio || '',
          socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
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
    <>
      <Navbar />
      <ProfileMenu />
      <div style={{ 
        minHeight: '100vh', 
        background: '#f7f6f2',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          maxWidth: '500px', 
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
            Create Your Account
          </h2>
          <p style={{ 
            color: '#666',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Join our community of storytellers
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem',
            gap: '2rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step === 1 ? '#2d2540' : '#ddd',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                1
              </div>
              <span style={{ 
                color: step === 1 ? '#2d2540' : '#666',
                fontSize: '0.875rem',
                fontWeight: step === 1 ? 'bold' : 'normal'
              }}>
                Account Details
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step === 2 ? '#2d2540' : '#ddd',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                2
              </div>
              <span style={{ 
                color: step === 2 ? '#2d2540' : '#666',
                fontSize: '0.875rem',
                fontWeight: step === 2 ? 'bold' : 'normal'
              }}>
                Profile Info
              </span>
            </div>
          </div>

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

            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="username" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
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
                  <label htmlFor="email" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Email address *
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
                    Password *
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

                <div>
                  <label htmlFor="confirmPassword" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
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

                <button
                  type="button"
                  onClick={nextStep}
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
                  Next Step
                </button>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="bio" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label htmlFor="twitter" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    name="social.twitter"
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    name="social.instagram"
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>

                <div>
                  <label htmlFor="website" style={{ 
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#666'
                  }}>
                    Website
                  </label>
                  <input
                    id="website"
                    name="social.website"
                    type="url"
                    value={formData.socialLinks.website}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#f0f0f0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
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
                    Create Account
                  </button>
                </div>
              </>
            )}
          </form>

          <div style={{ 
            marginTop: '2rem',
            textAlign: 'center',
            color: '#666',
            fontSize: '0.875rem'
          }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2d2540',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup_page;