import React from "react";
import StoryCard from "./StoryCard";

const StoriesGrid = ({ stories }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
    {stories.map((story, idx) => (
      <StoryCard key={idx} {...story} />
    ))}
  </div>
);

export default StoriesGrid; 