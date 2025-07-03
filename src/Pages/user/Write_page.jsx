import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import ProfileMenu from '../components/user/ProfileMenu';
import { useTheme } from '../../context/ThemeContext';

const Write_page = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [genre, setGenre] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const genres = [
    'Fantasy', 'Mystery', 'Romance', 'Science Fiction', 
    'Horror', 'Adventure', 'Thriller', 'Historical Fiction',
    'Literary Fiction', 'Young Adult'
  ];

  useEffect(() => {
    // Fetch story data if in edit mode
    const fetchStory = async () => {
      if (!id) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`);
        if (!response.ok) {
          throw new Error('Story not found');
        }
        const data = await response.json();
        
        // Check if current user is the author
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser || currentUser.id !== data.author._id) {
          navigate('/');
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setGenre(data.genre);
        setIsEditMode(true);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStory();
  }, [id, navigate]);

  useEffect(() => {
    // Calculate word count
    const words = content.trim().split(/\s+/);
    const validWords = words.filter(word => word.length > 0);
    const wordCount = validWords.length;
    setWordCount(wordCount);
    
    // Calculate character count
    setCharCount(content.length);
    
    // Calculate reading time (assuming average reading speed of 200 words per minute)
    const minutes = Math.ceil(wordCount / 200);
    setReadingTime(minutes || 0); // Ensure we don't show negative or NaN

    // Check if form is valid
    setIsFormValid(
      title.trim().length > 0 && 
      genre.trim().length > 0 && 
      content.trim().length > 0
    );
  }, [content, title, genre]);

  const handlePublish = async () => {
    if (!isFormValid) return;

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      setError('Please log in to publish a story');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_URL}/api/stories/${id}`
        : `${import.meta.env.VITE_API_URL}/api/stories`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          genre: genre.trim(),
          author: currentUser.id,
          tags: [genre.trim()], // Using genre as a tag for now
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the story page
        navigate(`/Story/${data._id || id}`);
      } else {
        setError(data.message || 'Failed to publish story');
      }
    } catch (err) {
      setError('An error occurred while publishing the story');
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
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
          margin: '0 auto',
          display: 'flex',
          gap: '2rem'
        }}>
          {/* Main Writing Area */}
          <div style={{ flex: 1 }}>
            {error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter your story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.5rem',
                border: 'none',
                borderRadius: '10px',
                marginBottom: '1rem',
                background: theme === 'dark' ? '#232336' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '10px',
                marginBottom: '1rem',
                background: theme === 'dark' ? '#232336' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              <option value="">Select a genre</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story..."
              style={{
                width: '100%',
                minHeight: '60vh',
                padding: '1rem',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                border: 'none',
                borderRadius: '10px',
                background: theme === 'dark' ? '#232336' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                resize: 'vertical'
              }}
            />
          </div>
          {/* Sidebar */}
          <div style={{ 
            width: '300px',
            background: theme === 'dark' ? '#232336' : '#fff',
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: 'fit-content',
            color: theme === 'dark' ? '#fff' : '#333'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              color: theme === 'dark' ? '#fff' : '#333',
              marginBottom: '1.5rem'
            }}>
              Story Statistics
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: theme === 'dark' ? '#bbb' : '#666' }}>Words:</span>
                <span style={{ fontWeight: 'bold' }}>{wordCount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: theme === 'dark' ? '#bbb' : '#666' }}>Characters:</span>
                <span style={{ fontWeight: 'bold' }}>{charCount}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between'
              }}>
                <span style={{ color: theme === 'dark' ? '#bbb' : '#666' }}>Reading time:</span>
                <span style={{ fontWeight: 'bold' }}>{readingTime} min</span>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ 
                fontSize: '1rem', 
                color: theme === 'dark' ? '#fff' : '#333',
                marginBottom: '0.5rem'
              }}>
                Writing Tips
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                color: theme === 'dark' ? '#bbb' : '#666',
                fontSize: '0.9rem'
              }}>
                <li style={{ marginBottom: '0.5rem' }}>• Start with a hook</li>
                <li style={{ marginBottom: '0.5rem' }}>• Show, don't tell</li>
                <li style={{ marginBottom: '0.5rem' }}>• Create memorable characters</li>
                <li>• Keep the reader engaged</li>
              </ul>
            </div>
            <button
              onClick={handlePublish}
              disabled={!isFormValid || isPublishing}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#fff',
                background: isFormValid && !isPublishing ? (theme === 'dark' ? '#35355a' : '#333') : '#ccc',
                border: 'none',
                borderRadius: '25px',
                cursor: isFormValid && !isPublishing ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: isFormValid && !isPublishing ? 1 : 0.7
              }}
            >
              {isPublishing ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Write_page;
