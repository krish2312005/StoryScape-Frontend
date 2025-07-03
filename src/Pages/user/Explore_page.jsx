import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import ProfileMenu from '../components/user/ProfileMenu';
import { useTheme } from '../../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const Explore_page = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = [
    'All',
    'Fantasy',
    'Mystery', 
    'Romance', 
    'Science Fiction', 
    'Horror', 
    'Adventure',
    'Thriller',
    'Historical Fiction',
    'Literary Fiction',
    'Young Adult'
  ];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/stories`);
        setStories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const filteredStories = selectedGenre === 'All' 
    ? stories 
    : stories.filter(story => story.genre === selectedGenre);

  const handleReadMore = (storyId) => {
    navigate(`/story/${storyId}`);
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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Explore Stories
          </h1>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: selectedGenre === genre 
                    ? (theme === 'dark' ? '#232336' : '#333') 
                    : (theme === 'dark' ? '#232336' : '#fff'),
                  color: selectedGenre === genre 
                    ? '#fff' 
                    : (theme === 'dark' ? '#bbb' : '#333'),
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading stories...
            </div>
          ) : filteredStories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              No stories found for this genre.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              padding: '2rem 0'
            }}>
              {filteredStories.map((story) => (
                <div key={story._id} style={{
                  background: theme === 'dark' ? '#232336' : '#fff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ padding: '1.5rem' }}>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      marginBottom: '1rem',
                      color: theme === 'dark' ? '#fff' : '#333'
                    }}>
                      {story.title}
                    </h2>
                    <p style={{ 
                      color: theme === 'dark' ? '#bbb' : '#666',
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
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
                      <button 
                        onClick={() => handleReadMore(story._id)}
                        style={{
                          color: theme === 'dark' ? '#fff' : '#333',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore_page;
