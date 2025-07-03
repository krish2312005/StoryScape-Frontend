import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/user/Navbar";
import ProfileMenu from "../components/user/ProfileMenu";
import StoriesGrid from "../components/user/StoriesGrid";
import Sidebar from "../components/user/Sidebar";
import { useTheme } from '../../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const Home_Page = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [stories, setStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Fetch followed authors' stories
        const followingRes = await fetch(`${API_URL}/api/follows/following/${currentUser.id}`);
        const following = await followingRes.json();
        
        const storiesRes = await fetch(`${API_URL}/api/stories`);
        const allStories = await storiesRes.json();

        // Filter stories from followed authors
        const followedAuthorIds = following.map(f => f.following._id);
        const filteredStories = allStories.filter(story => 
          followedAuthorIds.includes(story.author._id)
        );

        // Get trending stories (most liked stories)
        const trendingStories = allStories
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 5)
          .map(story => ({
            title: story.title,
            meta: `${story.likes?.length || 0} likes · ${story.author.username}`,
            id: story._id,
            author: story.author // Include the full author object
          }));

        setStories(filteredStories);
        setTrendingStories(trendingStories);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <ProfileMenu />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          background: theme === 'dark' ? '#181824' : '#f7f6f2',
          flexDirection: 'column',
          gap: '1rem',
          color: theme === 'dark' ? '#fff' : '#333'
        }}>
          <h2 style={{ color: theme === 'dark' ? '#fff' : '#333', fontSize: '1.5rem' }}>Please log in to see stories from authors you follow</h2>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '0.75rem 1.5rem',
              background: theme === 'dark' ? '#232336' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Log In
          </button>
        </div>
      </>
    );
  }

  return (
    <div style={{ background: theme === 'dark' ? '#181824' : '#f7f6f2', minHeight: '100vh' }}>
      <Navbar />
      <ProfileMenu />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        padding: '3rem 2rem', 
        background: theme === 'dark' ? '#181824' : '#f7f6f2', 
        minHeight: '100vh',
        color: theme === 'dark' ? '#fff' : '#333'
      }}>
        <div style={{ flex: 1, maxWidth: 1100 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: theme === 'dark' ? '#fff' : '#333' }}>Loading stories...</div>
          ) : error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#dc2626' 
            }}>
              {error}
            </div>
          ) : stories.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: theme === 'dark' ? '#bbb' : '#666'
            }}>
              No stories from followed authors yet. 
              <br />
              <button 
                onClick={() => navigate('/Explore')}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: theme === 'dark' ? '#232336' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Explore Stories
              </button>
            </div>
          ) : (
            <StoriesGrid stories={stories} />
          )}
        </div>
        <Sidebar trending={trendingStories} />
      </div>
    </div>
  );
};

export default Home_Page;
