import React from "react";

const AvatarDisplay = ({ user, size = 40 }) => {
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

export default AvatarDisplay;
