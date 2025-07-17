import React from "react";
import AvatarDisplay from "./AvatarDisplay";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';

const StoryCard = ({ _id, author, genre, title, content }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleReadMore = (e) => {
    e.stopPropagation();
    navigate(`/story/${_id}`);
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-6 w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white dark:bg-[#232336] transition-transform duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
      onClick={handleReadMore}
    >
      <div className="flex items-center mb-4">
        <div className="flex items-center flex-1">
          <AvatarDisplay user={author} size={40} />
          <div className="ml-3">
            <div className="font-medium text-gray-900 dark:text-white">{author.username}</div>
          </div>
        </div>
        <span className="bg-indigo-50 dark:bg-[#181824] text-indigo-700 dark:text-indigo-100 rounded-full px-3 py-1 text-xs font-semibold ml-2">
          {genre}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-300 text-base mb-6 line-clamp-3">
        {content}
      </p>
      <button
        onClick={handleReadMore}
        className="mt-auto px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        tabIndex={-1}
      >
        Read more &rarr;
      </button>
    </div>
  );
};

export default StoryCard;