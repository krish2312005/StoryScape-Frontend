import React from 'react';

const GenreFilter = ({ genres, selectedGenre, onGenreSelect }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      marginBottom: '2rem'
    }}>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreSelect(genre)}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '25px',
            border: 'none',
            background: selectedGenre === genre ? '#333' : '#fff',
            color: selectedGenre === genre ? '#fff' : '#333',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            ':hover': {
              background: '#333',
              color: '#fff'
            }
          }}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter; 