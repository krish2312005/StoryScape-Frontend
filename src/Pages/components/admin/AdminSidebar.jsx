import React from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  height: "100vh",
  width: 260,
  background: "#fff",
  boxShadow: "2px 0 8px rgba(44, 37, 64, 0.06)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "2rem 1rem 1rem 1rem",
  zIndex: 100,
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  marginTop: "2rem",
  alignItems: "center",
};

const bottomStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
};

const avatarStyle = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #edeaf3",
};

const AdminSidebar = ({ admin, onLogout }) => {
  const location = useLocation();

  const getLinkStyle = (path) => ({
    color: location.pathname === path ? "#2d2540" : "#666",
    fontWeight: location.pathname === path ? 700 : 500,
    textAlign: "center",
    textDecoration: 'none',
    padding: "0.5rem",
    borderRadius: "0.5rem",
    width: "100%",
    background: location.pathname === path ? "#edeaf3" : "transparent",
    transition: "all 0.3s ease"
  });

  return (
    <aside style={sidebarStyle}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: "1.5rem", color: "#2d2540", textAlign: "center" }}>Admin</div>
        <nav style={navStyle}>
          <Link to="/Admin" style={getLinkStyle("/Admin")}>Dashboard</Link>
          <Link to="/Admin/Users" style={getLinkStyle("/Admin/Users")}>Users</Link>
          <Link to="/Admin/Stories" style={getLinkStyle("/Admin/Stories")}>Stories</Link>
          <Link to="/Admin/Comments" style={getLinkStyle("/Admin/Comments")}>Comments</Link>
        </nav>
    </div>
    <div style={bottomStyle}>
      {/*
      <img src={admin.avatar} alt="Admin" style={avatarStyle} /> 
      <div style={{ color: "#2d2540", fontWeight: 600, textAlign: "center" }}>{admin.name}</div>
      
      <button
        onClick={onLogout}
        style={{
          background: "#edeaf3",
          color: "#2d2540",
          border: "none",
          borderRadius: "1.5rem",
          padding: "0.5rem 2rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      */}
    </div>
  </aside>
  );
};

export default AdminSidebar;