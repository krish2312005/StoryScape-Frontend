import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarDisplay from "./AvatarDisplay";
import { useTheme } from '../../../context/ThemeContext';

const Sidebar = ({ trending = [] }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <aside
      className={`rounded-2xl p-6 md:p-8 w-full md:w-80 mt-4 md:mt-0 md:ml-8 shadow-xl transition-colors duration-300 border border-transparent dark:border-[#232336] bg-white dark:bg-[#232336]`}
    >
      <h4 className="text-xl font-bold mb-6 text-indigo-700 dark:text-indigo-200 tracking-tight">Trending Stories</h4>
      {trending.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-400">No trending stories yet</p>
      ) : (
        <ul className="space-y-5">
          {trending.map((story, idx) => (
            <li
              key={idx}
              className="flex items-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-[#181824] rounded-xl p-3 transition-colors group"
              onClick={() => navigate(`/story/${story.id}`)}
            >
              <AvatarDisplay user={story.author} size={48} />
              <div className="flex flex-col ml-4 flex-1 min-w-0">
                <span className="font-semibold truncate text-indigo-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-200" title={story.title}>
                  {story.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {story.meta}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;