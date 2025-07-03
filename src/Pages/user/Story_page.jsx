import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Navbar from '../components/user/Navbar';
import ProfileMenu from '../components/user/ProfileMenu';
import { useTheme } from '../../context/ThemeContext';

const AvatarDisplay = ({ user, size = 100 }) => {
  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (username) => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFC107', '#FF9800', '#FF5722'
    ];
    const index = username ? username.length % colors.length : 0;
    return colors[index];
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: getRandomColor(user?.username),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.4}px`,
        color: '#fff',
        fontWeight: 'bold'
      }}
    >
      {getInitials(user?.username)}
    </div>
  );
};

const Story_page = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [followError, setFollowError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStoryAndComments = async () => {
      try {
        // Fetch story
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}`);
        if (!response.ok) {
          throw new Error('Story not found');
        }
        const data = await response.json();
        
        // Fetch comments for the story
        const commentsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/story/${id}`);
        let comments = [];
        if (commentsRes.ok) {
          comments = await commentsRes.json();
        }

        // Fetch complete author data including all counts
        const [authorRes, storiesRes, followersRes, followingRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/users/${data.author._id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/stories`),
          fetch(`${import.meta.env.VITE_API_URL}/api/follows/followers/${data.author._id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/follows/following/${data.author._id}`)
        ]);
        
        const authorData = await authorRes.json();
        const storiesData = await storiesRes.json();
        const followersData = await followersRes.json();
        const followingData = await followingRes.json();

        // Combine all data
        // Filter stories to only include the author's stories
        const authorStories = Array.isArray(storiesData) 
          ? storiesData.filter(story => story.author._id === data.author._id)
          : [];

        const enrichedAuthorData = {
          ...authorData,
          stories: authorStories,
          followers: Array.isArray(followersData) ? followersData : [],
          following: Array.isArray(followingData) ? followingData : []
        };
        
        setStory({ 
          ...data, 
          comments,
          author: enrichedAuthorData
        });
        // Check if current user has liked the story
        if (currentUser) {
          setIsLiked(data.likes.includes(currentUser.id));
        }
        // Check if current user is already following the author
        if (currentUser && data.author) {
          const followersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/follows/followers/${data.author._id}`);
          const followersData = await followersResponse.json();
          const isAlreadyFollowing = followersData.some(follow => follow.follower._id === currentUser.id);
          setIsFollowing(isAlreadyFollowing);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStoryAndComments();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) {
      setError('Please log in to like stories');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (response.ok) {
        const updatedStory = await response.json();
        setStory(prev => ({ ...prev, likes: updatedStory.likes }));
        setIsLiked(!isLiked);
      }
    } catch (err) {
      setError('Failed to update like status');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please log in to comment');
      return;
    }
    if (!comment.trim()) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story: id,
          user: currentUser.id,
          content: comment.trim(),
        }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setStory(prev => ({
          ...prev,
          comments: [...prev.comments, newComment],
        }));
        setComment('');
      }
    } catch (err) {
      setError('Failed to post comment');
    }
  };

  const handleFollow = async () => {
    setFollowError('');
    if (!currentUser) {
      setFollowError('Please log in to follow authors');
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow the author
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/follows/follower/${currentUser.id}/following/${story.author._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsFollowing(false);
          // Fetch updated author data
          const authorResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${story.author._id}`);
          const authorData = await authorResponse.json();
          // Update the story state with new author data
          setStory(prev => ({
            ...prev,
            author: authorData
          }));
        } else {
          const data = await response.json();
          setFollowError(data.message || 'Failed to unfollow author');
        }
      } else {
        // Follow the author
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/follows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            follower: currentUser.id,
            following: story.author._id,
          }),
        });
        if (response.ok) {
          setIsFollowing(true);
          // Fetch updated author data
          const authorResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${story.author._id}`);
          const authorData = await authorResponse.json();
          // Update the story state with new author data
          setStory(prev => ({
            ...prev,
            author: authorData
          }));
        } else {
          const data = await response.json();
          setFollowError(data.message || 'Failed to follow author');
        }
      }
    } catch (err) {
      setFollowError(isFollowing ? 'Failed to unfollow author' : 'Failed to follow author');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <ProfileMenu />
        <div style={{ 
          minHeight: '100vh', 
          background: theme === 'dark' ? '#181824' : '#f7f6f2',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Loading story...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <ProfileMenu />
        <div style={{ 
          minHeight: '100vh', 
          background: theme === 'dark' ? '#181824' : '#f7f6f2',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ 
            background: theme === 'dark' ? '#2d2540' : '#fee2e2',
            border: theme === 'dark' ? '1px solid #3d3550' : '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '1.1rem'
          }}>
            {error}
          </div>
        </div>
      </>
    );
  }

  if (!story) {
    console.log('Story is null or undefined:', story);
    return null;
  }

  return (
    <>
      <Navbar />
      <ProfileMenu />
      <div style={{ 
        minHeight: '100vh', 
        background: theme === 'dark' ? '#181824' : '#f7f6f2',
        padding: '2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          gap: '2rem'
        }}>
          {/* Main Story Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: theme === 'dark' ? '#232336' : '#fff',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                color: theme === 'dark' ? '#fff' : '#333',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                {story.title}
              </h1>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                color: theme === 'dark' ? '#bbb' : '#666'
              }}>
                <span>{story.genre}</span>
                <span>•</span>
                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{Math.ceil(story.content.split(/\s+/).length / 200)} min read</span>
              </div>

              <div style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: theme === 'dark' ? '#eee' : '#444',
                whiteSpace: 'pre-line'
              }}>
                {story.content}
              </div>

              <div style={{
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: theme === 'dark' ? '1px solid #333' : '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleLike}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: isLiked ? '#dc2626' : (theme === 'dark' ? '#bbb' : '#666'),
                      fontSize: '1rem'
                    }}
                  >
                    <span>❤️</span> {story.likes.length}
                  </button>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: theme === 'dark' ? '#bbb' : '#666',
                    fontSize: '1rem'
                  }}>
                    <span>💬</span> {story.comments?.length || 0}
                  </div>
                </div>
                {currentUser && currentUser.id === story.author._id && (
                  <button
                    onClick={() => navigate(`/Write/${story._id}`)}
                    style={{
                      background: theme === 'dark' ? '#3d3550' : '#2d2540',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    ✏️ Edit Story
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  color: theme === 'dark' ? '#fff' : '#333',
                  marginBottom: '1.5rem'
                }}>
                  Comments
                </h3>

                {currentUser && (
                  <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                        marginBottom: '1rem',
                        fontSize: '1rem',
                        resize: 'vertical',
                        background: theme === 'dark' ? '#232336' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#333'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      style={{
                        background: comment.trim() ? (theme === 'dark' ? '#3d3550' : '#2d2540') : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '0.75rem 1.5rem',
                        cursor: comment.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '1rem'
                      }}
                    >
                      Post Comment
                    </button>
                  </form>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {story.comments?.map((comment) => (
                    <div key={comment._id} style={{
                      padding: '1rem',
                      background: theme === 'dark' ? '#181824' : '#f8f8f8',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <AvatarDisplay user={comment.user} size={40} />
                        <div>
                          <div style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>
                            {comment.user.username}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#bbb' : '#666' }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p style={{ color: theme === 'dark' ? '#eee' : '#444', lineHeight: '1.6' }}>
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Author Information */}
          <div style={{ width: '300px' }}>
            <div style={{
              background: theme === 'dark' ? '#232336' : '#fff',
              borderRadius: '15px',
              padding: '1.5rem',
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <AvatarDisplay user={story.author} size={100} />
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  color: theme === 'dark' ? '#fff' : '#333',
                  marginBottom: '0.5rem'
                }}>
                  {story.author.username}
                </h2>
                <p style={{
                  color: theme === 'dark' ? '#bbb' : '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.6'
                }}>
                  {story.author.bio || 'No bio available'}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>
                    {story.author.stories?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Stories</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>
                    {Array.isArray(story.author.followers) ? story.author.followers.length : 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Followers</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#333' }}>
                    {Array.isArray(story.author.following) ? story.author.following.length : 0}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#bbb' : '#666' }}>Following</div>
                </div>
              </div>

              <Link to={`/UserProfile/${story.author._id}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: theme === 'dark' ? '#3d3550' : '#2d2540',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = theme === 'dark' ? '#4d4570' : '#3d3550'}
                onMouseOut={(e) => e.target.style.backgroundColor = theme === 'dark' ? '#3d3550' : '#2d2540'}>
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Story_page;
