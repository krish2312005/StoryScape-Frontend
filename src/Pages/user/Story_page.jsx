import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import { useTheme } from '../../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const Story_page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        // Fetch story
        const storyRes = await fetch(`${API_URL}/api/stories/${id}`);
        if (!storyRes.ok) {
          let message = 'Story not found';
          try {
            const data = await storyRes.json();
            message = data.message || message;
          } catch {}
          throw new Error(message);
        }
        const storyData = await storyRes.json();

        // Fetch comments
        let commentsData = [];
        try {
          const commentsRes = await fetch(`${API_URL}/api/stories/${id}/comments`);
          if (commentsRes.ok) {
            commentsData = await commentsRes.json();
          } else if (commentsRes.status !== 404) {
            // Only log error if not 404
            console.error('Failed to fetch comments:', commentsRes.status);
          }
        } catch (err) {
          // Only log error if not 404
        }

        setStory(storyData);
        setComments(commentsData);
        if (currentUser) {
          setIsLiked(storyData.likes?.includes(currentUser.id) || false);
        }
        if (currentUser && storyData.author._id !== currentUser.id) {
          try {
            const followRes = await fetch(`${API_URL}/api/follows/check/${currentUser.id}/${storyData.author._id}`);
            if (followRes.ok) {
              const followData = await followRes.json();
              setIsFollowing(followData.isFollowing);
            } else if (followRes.status === 404) {
              setIsFollowing(false); // Not following
            } else {
              // Only log error if not 404
              console.error('Failed to check follow:', followRes.status);
            }
          } catch (err) {
            // Ignore follow check errors
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load story.');
      } finally {
        setLoading(false);
      }
    };
    fetchStoryData();
  }, [id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return navigate('/login');
    try {
      const response = await fetch(`${API_URL}/api/stories/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (response.ok) {
        setIsLiked(!isLiked);
        setStory(prev => ({
          ...prev,
          likes: isLiked
            ? prev.likes.filter(id => id !== currentUser.id)
            : [...(prev.likes || []), currentUser.id]
        }));
      }
    } catch {}
  };

  const handleFollow = async () => {
    if (!currentUser) return navigate('/login');
    try {
      const response = await fetch(`${API_URL}/api/follows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower: currentUser.id, following: story.author._id }),
      });
      if (response.ok) setIsFollowing(!isFollowing);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) return navigate('/login');
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/stories/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim(), author: currentUser.id, story: id }),
      });
      if (response.ok) {
        const newCommentData = await response.json();
        setComments(prev => [newCommentData, ...prev]);
        setNewComment('');
      }
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
          <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-indigo-700'} font-semibold text-lg md:text-xl`}>Loading story...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'}`}>
          <div className={`rounded-2xl shadow-xl p-8 max-w-md w-full text-center ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>
            <h2 className={`font-bold mb-4 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Story Not Found</h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-base md:text-lg`}>{error}</p>
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
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181824]' : 'bg-[#f7f6f2]'} px-4 py-8 md:py-12`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
          {/* Main Content */}
          <div className="flex-1 w-full min-w-0">
            <div className={`rounded-2xl shadow-xl p-6 md:p-10 mb-6 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`}>  
              {/* Story Header */}
              <div className="mb-8">
                <h1 className={`font-extrabold mb-4 text-2xl md:text-4xl leading-tight ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{story.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-[#444] text-white' : 'bg-indigo-100 text-indigo-700'}`}>{story.author.username.charAt(0).toUpperCase()}</div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{story.author.username}</span>
                  </div>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(story.createdAt).toLocaleDateString()}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme === 'dark' ? 'bg-[#444] text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`}>{story.genre}</span>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <button
                    onClick={handleLike}
                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm ${isLiked ? 'bg-red-500 text-white' : theme === 'dark' ? 'bg-[#444] text-white hover:bg-[#35355a]' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                  >
                    ❤️ {story.likes?.length || 0} Likes
                  </button>
                  {currentUser && story.author._id !== currentUser.id && (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all shadow-sm ${isFollowing ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-[#444] text-white hover:bg-[#35355a]' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    >
                      {isFollowing ? '✓ Following' : '+ Follow'}
                    </button>
                  )}
                </div>
              </div>
              {/* Story Content */}
              <div className={`prose prose-lg max-w-none mb-12 ${theme === 'dark' ? 'prose-invert' : ''}`}>{story.content.split('\n').map((paragraph, index) => (<p key={index}>{paragraph}</p>))}</div>
              {/* Comments Section */}
              <div>
                <h3 className={`font-bold mb-6 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Comments ({comments.length})</h3>
                {currentUser && (
                  <form onSubmit={handleComment} className="mb-8">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className={`w-full min-h-[100px] p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-vertical mb-4 ${theme === 'dark' ? 'bg-[#232336] text-white border-[#444]' : 'bg-white text-indigo-900 border-gray-200'}`}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all shadow-sm ${newComment.trim() && !isSubmitting ? (theme === 'dark' ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-indigo-700 text-white hover:bg-indigo-800') : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>
                )}
                <div className="flex flex-col gap-6">
                  {comments.map((comment) => (
                    <div key={comment._id} className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-indigo-50'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base ${theme === 'dark' ? 'bg-[#444] text-white' : 'bg-indigo-100 text-indigo-700'}`}>{comment.user.username.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{comment.user.username}</div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(comment.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className={`text-base ${theme === 'dark' ? 'text-gray-200' : 'text-indigo-900'}`}>{comment.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="hidden md:block w-full md:w-80 flex-shrink-0">
            <div className={`rounded-2xl shadow-xl p-8 sticky top-8 ${theme === 'dark' ? 'bg-[#232336]' : 'bg-white'}`} style={{height: 'fit-content'}}>
              <h3 className={`font-bold mb-6 text-lg md:text-xl ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>About the Author</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${theme === 'dark' ? 'bg-[#444] text-white' : 'bg-indigo-100 text-indigo-700'}`}>{story.author.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{story.author.username}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Member since {new Date(story.author.createdAt).getFullYear()}</div>
                </div>
              </div>
              {currentUser && story.author._id !== currentUser.id && (
                <button
                  onClick={handleFollow}
                  className={`w-full py-3 rounded-lg font-semibold transition-all shadow-sm mb-6 ${isFollowing ? 'bg-green-500 text-white' : theme === 'dark' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-indigo-700 text-white hover:bg-indigo-800'}`}
                >
                  {isFollowing ? '✓ Following' : '+ Follow Author'}
                </button>
              )}
              <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-[#181824]' : 'bg-indigo-50'}`}>
                <h4 className={`font-bold mb-4 text-base ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>Story Stats</h4>
                <div className="flex justify-between mb-2 text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Likes:</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{story.likes?.length || 0}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Comments:</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{comments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Reading time:</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{Math.ceil(story.content.split(' ').length / 200)} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Story_page;

