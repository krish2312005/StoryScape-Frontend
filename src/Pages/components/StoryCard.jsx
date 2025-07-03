import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          color: '#333'
        }}>
          {story.title}
        </h2>
        <p style={{ 
          color: '#666',
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
            background: '#f0f0f0',
            padding: '0.3rem 0.8rem',
            borderRadius: '15px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            {story.genre}
          </span>
          <Link 
            to={`/story/${story.id}`}
            style={{
              color: '#333',
              textDecoration: 'none',
              fontWeight: 'bold',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryCard; 