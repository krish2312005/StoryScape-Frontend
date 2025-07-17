import React from "react";
import StoryCard from "./StoryCard";

const StoriesGrid = ({ stories }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
    {stories.map((story, idx) => (
      <StoryCard key={idx} {...story} />
    ))}
  </div>
);

export default StoriesGrid; 