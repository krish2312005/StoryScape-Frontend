import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const admin = {
  name: "Admin",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const User_Page = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      setError('Failed to fetch users');
    }
  };

  const handleEditClick = (user) => {
    setEditedUser({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      avatar: user.avatar || '',
      socialLinks: {
        twitter: user.socialLinks?.twitter || '',
        instagram: user.socialLinks?.instagram || '',
        website: user.socialLinks?.website || ''
      }
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setEditedUser(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value
        }
      }));
    } else {
      setEditedUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${editedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        setSuccessMsg('User updated successfully');
        fetchUsers();
        setIsEditing(false);
        setEditedUser(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update user');
      }
    } catch (error) {
      setError('An error occurred while updating the user');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(null);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMsg('User deleted successfully');
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });

      if (response.ok) {
        setSuccessMsg('User created successfully');
        fetchUsers();
        setNewUserData({
          username: '',
          email: '',
          password: '',
        });
        setIsCreating(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create user');
      }
    } catch (error) {
      setError('An error occurred while creating the user');
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f6f2" }}>
      <AdminSidebar admin={admin} onLogout={() => {}} />
      <main style={{ marginLeft: 260, flex: 1, padding: "3rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#2d2540", fontSize: "2rem" }}>Manage Users</h2>
          <button
            onClick={() => setIsCreating(true)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2d2540",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>+</span>
            Create User
          </button>
        </div>
        
        {/* Error/Success Messages */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {successMsg}
          </div>
        )}

        {/* Users Table */}
        <div style={{ 
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(44, 37, 64, 0.06)",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ 
                background: "#f7f6f2",
                color: "#2d2540",
                textAlign: "left"
              }}>
                <th style={{ padding: "1rem" }}>Username</th>
                <th style={{ padding: "1rem" }}>Email</th>
                <th style={{ padding: "1rem" }}>Bio</th>
                <th style={{ padding: "1rem" }}>Social Links</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: "1px solid #edeaf3" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#edeaf3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#2d2540",
                          fontWeight: "bold"
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {user.username}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>{user.email}</td>
                  <td style={{ padding: "1rem" }}>
                    {user.bio ? (
                      <div style={{ 
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {user.bio}
                      </div>
                    ) : (
                      <span style={{ color: "#a6a3b2" }}>No bio</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {user.socialLinks?.twitter && (
                        <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: "#1da1f2" }}>Twitter</a>
                      )}
                      {user.socialLinks?.instagram && (
                        <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#e1306c" }}>Instagram</a>
                      )}
                      {user.socialLinks?.website && (
                        <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" style={{ color: "#2d2540" }}>Website</a>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditClick(user)}
                        style={{
                          background: "#edeaf3",
                          color: "#2d2540",
                          border: "none",
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.875rem"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.875rem"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit User Modal */}
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
              background: '#fff',
              borderRadius: '15px',
              padding: '2rem',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '1.5rem'
              }}>
                Edit User Profile
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={editedUser.avatar}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Bio</label>
                <textarea
                  name="bio"
                  value={editedUser.bio}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Twitter</label>
                <input
                  type="text"
                  name="social.twitter"
                  value={editedUser.socialLinks.twitter}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Instagram</label>
                <input
                  type="text"
                  name="social.instagram"
                  value={editedUser.socialLinks.instagram}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Website</label>
                <input
                  type="text"
                  name="social.website"
                  value={editedUser.socialLinks.website}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  onClick={handleCancel}
                  style={{ padding: '0.75rem 1.5rem', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{ padding: '0.75rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {isCreating && (
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
              background: '#fff',
              borderRadius: '15px',
              padding: '2rem',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '1.5rem'
              }}>
                Create New User
              </h2>

              <form onSubmit={handleCreateUser}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={newUserData.username}
                    onChange={handleNewUserChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleNewUserChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    style={{ padding: '0.75rem 1.5rem', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.75rem 1.5rem', background: '#333', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default User_Page;
