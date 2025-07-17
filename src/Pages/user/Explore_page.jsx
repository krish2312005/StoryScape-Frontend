import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user/Navbar';
import GenreFilter from '../components/GenreFilter';
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
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'} px-4 py-8 md:py-12`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-3xl md:text-4xl font-extrabold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Explore Stories</h1>
          <GenreFilter genres={genres} selectedGenre={selectedGenre} onGenreSelect={setSelectedGenre} />
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className={`font-semibold text-lg md:text-xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Loading stories...</div>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className={`rounded-2xl shadow-xl p-8 max-w-lg w-full ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>No stories found for this genre.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
              {filteredStories.map((story) => (
                <div
                  key={story._id}
                  className={`rounded-2xl shadow-lg bg-white dark:bg-[#232336] transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between min-h-[260px]`}
                  onClick={() => handleReadMore(story._id)}
                >
                  <div className="p-6 flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">{story.title}</h2>
                    <p className="text-gray-500 dark:text-gray-300 text-base mb-4 line-clamp-3">{story.content}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="bg-indigo-50 dark:bg-[#181824] text-indigo-700 dark:text-indigo-100 rounded-full px-3 py-1 text-xs font-semibold">{story.genre}</span>
                      <button
                        onClick={e => { e.stopPropagation(); handleReadMore(story._id); }}
                        className="ml-2 px-4 py-1 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        Read More &rarr;
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
