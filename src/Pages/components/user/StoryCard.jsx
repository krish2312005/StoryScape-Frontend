import React from "react";
import AvatarDisplay from "./AvatarDisplay";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';

const StoryCard = ({ _id, author, genre, title, content }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleReadMore = () => {
    navigate(`/story/${_id}`);
  };

  // Theme colors
  const cardBg = theme === 'dark' ? '#232336' : '#fff';
  const cardShadow = theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(44, 37, 64, 0.06)';
  const cardText = theme === 'dark' ? '#fff' : '#2d2540';
  const genreBg = theme === 'dark' ? '#181824' : '#f7f6f2';
  const genreText = theme === 'dark' ? '#eee' : '#2d2540';
  const descText = theme === 'dark' ? '#bbb' : '#666';
  const buttonBg = theme === 'dark' ? '#3d3550' : '#edeaf3';
  const buttonText = theme === 'dark' ? '#fff' : '#2d2540';

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: '1.5rem',
        boxShadow: cardShadow,
        padding: '1.5rem',
        width: 320,
        marginBottom: '2rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={handleReadMore}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <AvatarDisplay user={author} size={40} />
          <div style={{ marginLeft: '0.75rem' }}>
            <div style={{
              fontWeight: '500',
              color: cardText,
            }}>
              {author.username}
            </div>
          </div>
        </div>
        <span style={{
          background: genreBg,
          color: genreText,
          borderRadius: '1rem',
          padding: '0.25rem 1rem',
          fontSize: '0.9rem',
        }}>
          {genre}
        </span>
      </div>

      <h3 style={{
        fontSize: '1.5rem',
        margin: '0.5rem 0',
        color: cardText,
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {title}
      </h3>

      <p style={{
        color: descText,
        fontSize: '1rem',
        marginBottom: '1.5rem',
        display: '-webkit-box',
        WebkitLineClamp: '3',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: '1.5',
      }}>
        {content}
      </p>

      <button
        onClick={handleReadMore}
        style={{
          background: buttonBg,
          color: buttonText,
          border: 'none',
          borderRadius: '1.5rem',
          padding: '0.75rem 2rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.2s ease',
        }}
        onMouseOver={e => (e.target.style.backgroundColor = theme === 'dark' ? '#4d4570' : '#d6d1e6')}
        onMouseOut={e => (e.target.style.backgroundColor = buttonBg)}
        tabIndex={-1}
      >
        Read more →
      </button>
    </div>
  );
};

export default StoryCard;