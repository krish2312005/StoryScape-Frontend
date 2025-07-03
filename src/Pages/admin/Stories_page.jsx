import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const admin = {
  name: "Admin",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const Stories_page = () => {
  const [stories, setStories] = useState([]);
  const [editedStory, setEditedStory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newStoryData, setNewStoryData] = useState({
    title: '',
    content: '',
    genre: '',
    tags: '',
    coverImage: '',
    author: '' // Reset author field
  });
  const [authors, setAuthors] = useState([]); // New state for authors

  // Fetch all stories and authors on component mount
  useEffect(() => {
    fetchStories();
    fetchAuthors(); // Fetch authors for the dropdown
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`);
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      } else {
        setError('Failed to fetch stories');
      }
    } catch (error) {
      setError('Failed to fetch stories');
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/authors`);
      if (response.ok) {
        const data = await response.json();
        setAuthors(data); // Set authors data
      } else {
        setError('Failed to fetch authors');
      }
    } catch (error) {
      setError('Failed to fetch authors');
    }
  };

  const handleEditClick = (story) => {
    setEditedStory({
      _id: story._id,
      title: story.title,
      content: story.content,
      genre: story.genre,
      author: story.author.username,
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewStoryChange = (e) => {
    const { name, value } = e.target;
    setNewStoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedStory = {
        ...editedStory,
        tags: editedStory.tags.split(',').map(tag => tag.trim())
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${editedStory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStory),
      });

      if (response.ok) {
        setSuccessMsg('Story updated successfully');
        fetchStories();
        setIsEditing(false);
        setEditedStory(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update story');
      }
    } catch (error) {
      setError('An error occurred while updating the story');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedStory(null);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMsg('Story deleted successfully');
        fetchStories();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete story');
      }
    } catch (error) {
      setError('Failed to delete story');
    }
  };

  // Added validation for the author field in handleCreateStory
  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!newStoryData.author) {
      setError('Please select an author');
      return;
    }

    try {
      const storyData = {
        ...newStoryData,
        tags: newStoryData.tags.split(',').map(tag => tag.trim())
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        setSuccessMsg('Story created successfully');
        fetchStories();
        setNewStoryData({
          title: '',
          content: '',
          genre: '',
          tags: '',
          coverImage: '',
          author: '' // Reset author field
        });
        setIsCreating(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create story');
      }
    } catch (error) {
      setError('An error occurred while creating the story');
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f6f2" }}>
      <AdminSidebar admin={admin} onLogout={() => {}} />
      <main style={{ marginLeft: 260, flex: 1, padding: "3rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#2d2540", fontSize: "2rem" }}>Manage Stories</h2>
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
            Create Story
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

        {/* Stories Table */}
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
                <th style={{ padding: "1rem" }}>Title</th>
                <th style={{ padding: "1rem" }}>Author</th>
                <th style={{ padding: "1rem" }}>Genre</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map(story => (
                <tr key={story._id} style={{ borderBottom: "1px solid #edeaf3" }}>
                  <td style={{ padding: "1rem" }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{story.title}</div>
                      <div style={{ fontSize: "0.875rem", color: "#666" }}>
                        {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {story.author.username}
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>{story.genre}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditClick(story)}
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
                        onClick={() => handleDelete(story._id)}
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

        {/* Edit Story Modal */}
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
              maxWidth: '800px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '1.5rem'
              }}>
                Edit Story
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedStory.title}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Content</label>
                <textarea
                  name="content"
                  value={editedStory.content}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '200px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={editedStory.genre}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
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

        {/* Create Story Modal */}
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
              maxWidth: '800px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: '1.5rem'
              }}>
                Create New Story
              </h2>

              <form onSubmit={handleCreateStory}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newStoryData.title}
                    onChange={handleNewStoryChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Content</label>
                  <textarea
                    name="content"
                    value={newStoryData.content}
                    onChange={handleNewStoryChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '200px', resize: 'vertical' }}
                  />
                </div>

                {/* Genre selection dropdown */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Genre</label>
                  <select
                    name="genre"
                    value={newStoryData.genre}
                    onChange={handleNewStoryChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  >
                    {['Fantasy', 'Mystery', 'Romance', 'Science Fiction', 'Horror', 'Adventure', 'Thriller', 'Historical Fiction', 'Literary Fiction', 'Young Adult'].map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Author selection dropdown */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>Author</label>
                  <select
                    name="author"
                    value={newStoryData.author}
                    onChange={handleNewStoryChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                  >
                    {authors.map(author => (
                      <option key={author._id} value={author._id}>{author.username}</option>
                    ))}
                  </select>
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
                    Create Story
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

export default Stories_page;
