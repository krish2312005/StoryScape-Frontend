import React from 'react';

const GenreFilter = ({ genres, selectedGenre, onGenreSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreSelect(genre)}
          className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-indigo-100 dark:border-[#232336] ${
            selectedGenre === genre
              ? 'bg-indigo-700 text-white shadow-md'
              : 'bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 dark:bg-[#232336] dark:text-indigo-200 dark:hover:bg-[#181824]'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter; 