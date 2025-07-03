import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import ProfileMenu from '../components/user/ProfileMenu';
import { useTheme } from '../../context/ThemeContext';

const User_profile_page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const userId = id || (currentUser && currentUser.id);
    if (!userId) {
      setUser(null);
      setEditedUser(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();

        // Fetch stories count
        const storiesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stories?author=${userId}`);
        const storiesData = await storiesRes.json();

        // Fetch followers
        const followersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/follows/followers/${userId}`);
        const followersData = await followersRes.json();

        // Fetch following
        const followingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/follows/following/${userId}`);
        const followingData = await followingRes.json();

        // Combine all data
        const combinedData = {
          ...userData,
          stories: Array.isArray(storiesData) ? storiesData : [],
          followers: Array.isArray(followersData) ? followersData : [],
          following: Array.isArray(followingData) ? followingData : []
        };

        setUser(combinedData);
        setEditedUser({
          name: userData.username,
          username: userData.username,
          avatar: userData.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: userData.bio || '',
          twitter: userData.socialLinks?.twitter || '',
          instagram: userData.socialLinks?.instagram || '',
          website: userData.socialLinks?.website || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser('notfound');
        setEditedUser(null);
      }
    };

    fetchUserData();
  }, [id, currentUser?.id]);

  if (!currentUser && !id) return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: theme === 'dark' ? '#181824' : '#f7f6f2',
      color: theme === 'dark' ? '#bbb' : '#666'
    }}>
      Please log in to view your profile.
    </div>
  );

  if (user === 'notfound') return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: theme === 'dark' ? '#181824' : '#f7f6f2',
      color: theme === 'dark' ? '#bbb' : '#666'
    }}>
      User not found.
    </div>
  );

  if (!user || !editedUser) return (
    <>
      <Navbar />
      <ProfileMenu />
      <div style={{
        minHeight: '100vh',
        background: theme === 'dark' ? '#181824' : '#f7f6f2',
        padding: '2rem',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Profile Header Skeleton */}
          <div style={{
            background: theme === 'dark' ? '#232336' : '#fff',
            borderRadius: '15px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: theme === 'dark' ? '#35355a' : '#f0f0f0',
              animation: 'pulse 1.5s infinite'
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                width: '200px',
                height: '32px',
                background: theme === 'dark' ? '#35355a' : '#f0f0f0',
                borderRadius: '8px',
                marginBottom: '1rem',
                animation: 'pulse 1.5s infinite'
              }} />
              <div style={{
                width: '150px',
                height: '20px',
                background: theme === 'dark' ? '#35355a' : '#f0f0f0',
                borderRadius: '8px',
                marginBottom: '1rem',
                animation: 'pulse 1.5s infinite'
              }} />
              <div style={{
                width: '100%',
                height: '60px',
                background: theme === 'dark' ? '#35355a' : '#f0f0f0',
                borderRadius: '8px',
                marginBottom: '1rem',
                animation: 'pulse 1.5s infinite'
              }} />
            </div>
          </div>

          {/* Stories Section Skeleton */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: theme === 'dark' ? '#232336' : '#fff',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '80%',
                  height: '24px',
                  background: theme === 'dark' ? '#35355a' : '#f0f0f0',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div style={{
                  width: '100%',
                  height: '80px',
                  background: theme === 'dark' ? '#35355a' : '#f0f0f0',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  animation: 'pulse 1.5s infinite'
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );

  const isCurrentUser = currentUser && (user._id === currentUser.id || user.id === currentUser.id);

  const handleEdit = () => {
    setEditedUser({
      username: user.username,
      avatar: user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: user.bio || '',
      twitter: user.socialLinks?.twitter || '',
      instagram: user.socialLinks?.instagram || '',
      website: user.socialLinks?.website || ''
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        username: editedUser.username,
        avatar: editedUser.avatar,
        bio: editedUser.bio,
        socialLinks: {
          twitter: editedUser.twitter || '',
          instagram: editedUser.instagram || '',
          website: editedUser.website || ''
        }
      };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        setEditedUser({
          username: updated.username,
          avatar: updated.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: updated.bio || '',
          twitter: updated.socialLinks?.twitter || '',
          instagram: updated.socialLinks?.instagram || '',
          website: updated.socialLinks?.website || ''
        });
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 2000);
        setIsEditing(false);
      } else {
        setSuccessMsg('Failed to update profile.');
      }
    } catch (err) {
      setSuccessMsg('An error occurred.');
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.username,
      username: user.username,
      avatar: user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: user.bio || '',
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`; // Vibrant but not too bright colors
  };

  const AvatarDisplay = ({ user }) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.username}
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #f7f6f2'
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: getRandomColor(user.username),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          color: '#fff',
          fontWeight: 'bold',
          border: '4px solid #f7f6f2'
        }}
      >
        {getInitials(user.username)}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <ProfileMenu />
      <div style={{
        minHeight: '100vh',
        background: theme === 'dark' ? '#181824' : '#f7f6f2',
        padding: '2rem',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Profile Header */}
          <div style={{
            background: theme === 'dark' ? '#232336' : '#fff',
            borderRadius: '15px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <AvatarDisplay user={user} />
            <div style={{ flex: 1, display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{
                  fontSize: '2rem',
                  color: theme === 'dark' ? '#fff' : '#333',
                  marginBottom: '0.5rem'
                }}>
                  {user.username}
                </h1>
                <p style={{
                  color: theme === 'dark' ? '#bbb' : '#666',
                  marginBottom: '1rem'
                }}>
                  @{user.username}
                </p>
                <p style={{
                  color: theme === 'dark' ? '#bbb' : '#666',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  {user.bio}
                </p>
                {/* Social Links */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {user.socialLinks?.twitter && (
                    <div>
                      <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', marginRight: '1rem', textDecoration: 'none', fontWeight: 'bold' }}>
                        Twitter
                      </a>
                    </div>
                  )}
                  {user.socialLinks?.instagram && (
                    <div>
                      <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c', marginRight: '1rem', textDecoration: 'none', fontWeight: 'bold' }}>
                        Instagram
                      </a>
                    </div>
                  )}
                  {user.socialLinks?.website && (
                    <div>
                      <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" style={{ color: theme === 'dark' ? '#fff' : '#333', textDecoration: 'none', fontWeight: 'bold' }}>
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                {/* Stats */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: theme === 'dark' ? '#fff' : '#333' }}>
                      {Array.isArray(user.stories) ? user.stories.filter(story => story.author._id === (currentUser?.id || user._id)).length : 0}
                    </div>
                    <div style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: '0.9rem' }}>Stories</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: theme === 'dark' ? '#fff' : '#333' }}>
                      {Array.isArray(user.followers) ? user.followers.length : 0}
                    </div>
                    <div style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: '0.9rem' }}>Followers</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: theme === 'dark' ? '#fff' : '#333' }}>
                      {Array.isArray(user.following) ? user.following.length : 0}
                    </div>
                    <div style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: '0.9rem' }}>Following</div>
                  </div>
                </div>
                {isCurrentUser && (
                  <button
                    onClick={handleEdit}
                    style={{
                      padding: '0.75rem 2rem',
                      background: theme === 'dark' ? '#35355a' : '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Stories Section */}
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{isCurrentUser ? 'Your Stories' : `${user.username}'s Stories`}</span>
              {isCurrentUser && (
                <button
                  onClick={() => navigate('/Write')}
                  style={{
                    padding: '0.5rem 1rem',
                    background: theme === 'dark' ? '#35355a' : '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>✍️</span> Write a Story
                </button>
              )}
            </h2>
            {user.stories && user.stories.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {user.stories
                  .filter(story => story.author._id === (currentUser?.id || user._id))
                  .map((story) => (
                    <div 
                      key={story._id} 
                      onClick={() => navigate(`/story/${story._id}`)}
                      style={{
                        background: theme === 'dark' ? '#232336' : '#fff',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                        ':hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <div style={{ padding: '1.5rem' }}>
                        <h3 style={{ 
                          fontSize: '1.5rem', 
                          marginBottom: '1rem',
                          color: theme === 'dark' ? '#fff' : '#333'
                        }}>
                          {story.title}
                        </h3>
                        <p style={{ 
                          color: theme === 'dark' ? '#bbb' : '#666',
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.6'
                        }}>
                          {story.content}
                        </p>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '1rem'
                        }}>
                          <span style={{
                            background: theme === 'dark' ? '#181824' : '#f0f0f0',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '15px',
                            fontSize: '0.9rem',
                            color: theme === 'dark' ? '#bbb' : '#666'
                          }}>
                            {story.genre}
                          </span>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            color: theme === 'dark' ? '#bbb' : '#666',
                            fontSize: '0.9rem'
                          }}>
                            <span>❤️ {story.likes?.length || 0}</span>
                            <span>💬 {story.comments?.length || 0}</span>
                            <span style={{
                              color: theme === 'dark' ? '#fff' : '#333',
                              fontWeight: 'bold'
                            }}>
                              Read More →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                color: theme === 'dark' ? '#bbb' : '#666'
              }}>
                <p>
                  {isCurrentUser 
                    ? "You haven't published any stories yet."
                    : `${user.username} hasn't published any stories yet.`}
                </p>
                {isCurrentUser && (
                  <button
                    onClick={() => navigate('/Write')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: theme === 'dark' ? '#35355a' : '#333',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>✍️</span> Write Your First Story
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Edit Profile Modal */}
          {isEditing && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: theme === 'dark' ? '#232336' : '#fff',
                borderRadius: '15px',
                padding: '2rem',
                width: '90%',
                maxWidth: '600px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: theme === 'dark' ? '#fff' : '#333'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  color: theme === 'dark' ? '#fff' : '#333',
                  marginBottom: '1.5rem'
                }}>
                  Edit Profile
                </h2>
                {successMsg && <div style={{ color: 'green', marginBottom: '1rem' }}>{successMsg}</div>}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: theme === 'dark' ? '#232336' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Avatar URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={editedUser.avatar}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: theme === 'dark' ? '#232336' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Bio</label>
                  <textarea
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', resize: 'vertical', background: theme === 'dark' ? '#232336' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Twitter</label>
                  <input
                    type="text"
                    name="twitter"
                    value={editedUser.twitter}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: theme === 'dark' ? '#232336' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={editedUser.instagram}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: theme === 'dark' ? '#232336' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={editedUser.website}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', background: theme === 'dark' ? '#232336' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button
                    onClick={handleCancel}
                    style={{ padding: '0.75rem 1.5rem', background: theme === 'dark' ? '#35355a' : '#f0f0f0', color: theme === 'dark' ? '#fff' : '#333', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{ padding: '0.75rem 1.5rem', background: theme === 'dark' ? '#35355a' : '#333', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default User_profile_page;
