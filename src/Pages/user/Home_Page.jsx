import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/user/Navbar";
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
        const followingRes = await fetch(`${API_URL}/api/follows/following/${currentUser.id}`);
        const following = await followingRes.json();
        const storiesRes = await fetch(`${API_URL}/api/stories`);
        const allStories = await storiesRes.json();
        const followedAuthorIds = following.map(f => f.following._id);
        const filteredStories = allStories.filter(story =>
          followedAuthorIds.includes(story.author._id)
        );
        const trendingStories = allStories
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 5)
          .map(story => ({
            title: story.title,
            meta: `${story.likes?.length || 0} likes · ${story.author.username}`,
            id: story._id,
            author: story.author
          }));
        setStories(filteredStories);
        setTrendingStories(trendingStories);
      } catch (err) {
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
        <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
          <div className={`rounded-2xl shadow-xl p-8 max-w-md w-full text-center ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
            <h2 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-indigo-700'} text-2xl md:text-3xl`}>Welcome to StoryScape</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>Please log in to see stories from authors you follow</p>
            <button
              onClick={() => navigate('/login')}
              className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition-all ${theme === 'dark' ? 'bg-[#232336] text-white hover:bg-[#35355a]' : 'bg-indigo-700 text-white hover:bg-indigo-800'}`}
            >
              Log In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'} min-h-screen`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className={`font-semibold text-lg md:text-xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Loading stories...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-6 py-4 text-base md:text-lg font-semibold">
              {error}
            </div>
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className={`rounded-2xl shadow-xl p-8 max-w-lg w-full ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
              <h3 className={`font-bold mb-2 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>No stories yet</h3>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>Follow authors to see their latest stories here!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <StoriesGrid stories={stories} />
            </div>
            <Sidebar trending={trendingStories} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home_Page;
