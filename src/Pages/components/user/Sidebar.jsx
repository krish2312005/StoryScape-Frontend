import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarDisplay from "./AvatarDisplay";
import { useTheme } from '../../../context/ThemeContext';

const Sidebar = ({ trending = [] }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const sidebarBg = theme === 'dark' ? '#232336' : '#fff';
  const sidebarShadow = theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(44, 37, 64, 0.06)';
  const headingColor = theme === 'dark' ? '#fff' : '#2d2540';
  const noTrendingColor = theme === 'dark' ? '#bbb' : '#666';
  const titleColor = theme === 'dark' ? '#fff' : '#2d2540';
  const metaColor = theme === 'dark' ? '#bbb' : '#a6a3b2';

  return (
    <div style={{ background: sidebarBg, borderRadius: '1.5rem', padding: '2rem 1.5rem', width: 320, marginLeft: '2rem', boxShadow: sidebarShadow }}>
      <h4 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: headingColor }}>Trending Stories</h4>
      {trending.length === 0 ? (
        <p style={{ color: noTrendingColor, textAlign: 'center' }}>No trending stories yet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {trending.map((story, idx) => (
            <li 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '1.25rem',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/story/${story.id}`)}
            >
              <AvatarDisplay user={story.author} size={48} />
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginLeft: '1rem',
                flex: 1
              }}>
                <span style={{ 
                  fontWeight: 600, 
                  color: titleColor,
                  marginBottom: '0.25rem',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {story.title}
                </span>
                <span style={{ 
                  color: metaColor, 
                  fontSize: '0.95rem' 
                }}>
                  {story.meta}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;