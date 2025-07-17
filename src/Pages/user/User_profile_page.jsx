import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
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
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();
        const storiesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stories?author=${userId}`);
        const storiesData = await storiesRes.json();
        const followersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/follows/followers/${userId}`);
        const followersData = await followersRes.json();
        const followingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/follows/following/${userId}`);
        const followingData = await followingRes.json();
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
        setUser('notfound');
        setEditedUser(null);
      }
    };
    fetchUserData();
  }, [id, currentUser?.id]);

  if (!currentUser && !id) return (
    <>
      <Navbar />
      <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
        <div className={`rounded-2xl shadow-xl p-8 max-w-md w-full text-center ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
          <h2 className={`font-bold mb-4 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Login Required</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>Please log in to view your profile.</p>
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

  if (user === 'notfound') return (
    <>
      <Navbar />
      <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
        <div className={`rounded-2xl shadow-xl p-8 max-w-md w-full text-center ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
          <h2 className={`font-bold mb-4 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>User Not Found</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition-all ${theme === 'dark' ? 'bg-[#232336] text-white hover:bg-[#35355a]' : 'bg-indigo-700 text-white hover:bg-indigo-800'}`}
          >
            Go Home
          </button>
        </div>
      </div>
    </>
  );

  if (!user || !editedUser) return (
    <>
      <Navbar />
      <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
        <div className="max-w-7xl w-full">
          <div className={`rounded-2xl shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 animate-pulse ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}> 
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 dark:bg-[#35355a]" />
            <div className="flex-1 w-full space-y-4">
              <div className="h-8 w-48 rounded bg-gray-200 dark:bg-[#35355a]" />
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-[#35355a]" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-[#35355a]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Modernized profile page layout
  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'} px-4 py-8 md:py-12`}>
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {/* Profile Header */}
          <div className={`rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}> 
            <img
              src={editedUser.avatar}
              alt={editedUser.username}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-100 dark:border-[#35355a]"
            />
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className={`font-extrabold text-2xl md:text-3xl mb-2 ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{editedUser.name}</h2>
              <div className={`mb-2 text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>@{editedUser.username}</div>
              <div className={`mb-4 text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{editedUser.bio}</div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                <span className={`rounded-full px-4 py-1 font-semibold text-sm ${theme === 'dark' ? 'bg-[#181824] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>Stories: {user.stories.length}</span>
                <span className={`rounded-full px-4 py-1 font-semibold text-sm ${theme === 'dark' ? 'bg-[#181824] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>Followers: {user.followers.length}</span>
                <span className={`rounded-full px-4 py-1 font-semibold text-sm ${theme === 'dark' ? 'bg-[#181824] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>Following: {user.following.length}</span>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {editedUser.twitter && <a href={editedUser.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>}
                {editedUser.instagram && <a href={editedUser.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>}
                {editedUser.website && <a href={editedUser.website} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Website</a>}
              </div>
            </div>
          </div>
          {/* User Stories */}
          <div className={`rounded-2xl shadow-xl p-8 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
            <h3 className={`font-bold mb-6 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Stories by {editedUser.name}</h3>
            {user.stories.length === 0 ? (
              <div className={`text-center text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No stories yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {user.stories.map((story) => (
                  <div
                    key={story._id}
                    className={`rounded-2xl shadow-lg bg-white dark:bg-[#181824] transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between min-h-[180px]`}
                    onClick={() => navigate(`/story/${story._id}`)}
                  >
                    <div className="p-6 flex flex-col h-full">
                      <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">{story.title}</h4>
                      <p className="text-gray-500 dark:text-gray-300 text-base mb-4 line-clamp-3">{story.content}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="bg-indigo-50 dark:bg-[#232336] text-indigo-700 dark:text-indigo-100 rounded-full px-3 py-1 text-xs font-semibold">{story.genre}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">{new Date(story.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default User_profile_page;
