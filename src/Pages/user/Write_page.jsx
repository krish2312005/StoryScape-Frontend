import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
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
        if (!response.ok) throw new Error('Story not found');
        const data = await response.json();
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
    const words = content.trim().split(/\s+/);
    const validWords = words.filter(word => word.length > 0);
    const wordCount = validWords.length;
    setWordCount(wordCount);
    setCharCount(content.length);
    const minutes = Math.ceil(wordCount / 200);
    setReadingTime(minutes || 0);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          genre: genre.trim(),
          author: currentUser.id,
          tags: [genre.trim()],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/Story/${data._id || id}`);
      } else {
        setError(data.message || 'Failed to publish story');
      }
    } catch (err) {
      setError('An error occurred while publishing the story');
    } finally {
      setIsPublishing(false);
    }
  };

  // Sidebar content for stats and tips + publish button
  const Sidebar = ({ showButton }) => (
    <aside className="w-full md:w-80 flex-shrink-0 mt-8 md:mt-0 md:ml-8">
      <div className={`rounded-2xl shadow-xl p-6 mb-6 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>  
        <h3 className={`font-bold mb-6 text-lg md:text-xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Story Statistics</h3>
        <div className="flex flex-col gap-3 mb-6 text-sm">
          <span className={`rounded-full px-3 py-1 font-semibold ${theme === 'dark' ? 'bg-[#181824] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>Words: {wordCount}</span>
          <span className={`rounded-full px-3 py-1 font-semibold ${theme === 'dark' ? 'bg-[#181824] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>Characters: {charCount}</span>
          <span className={`rounded-full px-3 py-1 font-semibold ${theme === 'dark' ? 'bg-[#181824] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>Reading time: {readingTime} min</span>
        </div>
        <h4 className={`font-bold mb-4 text-base ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Writing Tips</h4>
        <ul className={`list-disc pl-5 space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
          <li>Start with a compelling hook</li>
          <li>Show, don't tell</li>
          <li>Create memorable characters</li>
          <li>Keep the reader engaged</li>
        </ul>
        {showButton && (
          <button
            onClick={handlePublish}
            disabled={!isFormValid || isPublishing}
            className={`w-full mt-8 py-3 rounded-lg font-semibold text-lg shadow-md transition-all ${isFormValid && !isPublishing ? (theme === 'dark' ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-indigo-700 text-white hover:bg-indigo-800') : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isPublishing ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Story' : 'Publish Story')}
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'} px-4 py-8 md:py-12`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          {/* Main Writing Area */}
          <div className="flex-1 w-full min-w-0">
            <div className={`rounded-2xl shadow-xl p-6 md:p-10 mb-6 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>  
              <h1 className={`font-extrabold mb-6 text-2xl md:text-3xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{isEditMode ? 'Edit Story' : 'Write Your Story'}</h1>
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-6 py-4 text-base md:text-lg font-semibold mb-6">{error}</div>
              )}
              <div className="mb-6">
                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Story Title</label>
                <input
                  type="text"
                  placeholder="Enter your story title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg ${theme === 'dark' ? 'bg-[#232336] text-white border-[#444]' : 'bg-white text-indigo-900 border-gray-200'}`}
                />
              </div>
              <div className="mb-6">
                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Genre</label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base ${theme === 'dark' ? 'bg-[#232336] text-white border-[#444]' : 'bg-white text-indigo-900 border-gray-200'}`}
                >
                  <option value="">Select a genre</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Story Content</label>
                <textarea
                  placeholder="Write your story here..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className={`w-full min-h-[200px] p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base resize-vertical ${theme === 'dark' ? 'bg-[#232336] text-white border-[#444]' : 'bg-white text-indigo-900 border-gray-200'}`}
                />
              </div>
            </div>
            {/* Sidebar below form on mobile, with button */}
            <div className="block md:hidden w-full">
              <Sidebar showButton={true} />
            </div>
          </div>
          {/* Sidebar on right for desktop, with button */}
          <div className="hidden md:block w-full md:w-80 flex-shrink-0">
            <Sidebar showButton={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Write_page;
