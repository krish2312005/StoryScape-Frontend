import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";

const admin = {
  name: "Yionnel",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const ownerName = "krishowner";

const initialUsers = [
  { id: 1, name: "Alice", email: "alice@email.com" },
  { id: 2, name: "Bob", email: "bob@email.com" },
];

const Admin_Page = () => {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const alreadyAuth = sessionStorage.getItem("admin_authenticated");
    if (alreadyAuth === "true") {
      setIsAuthenticated(true);
      return;
    }
    const username = window.prompt("Enter username:");
    const password = window.prompt("Enter password:");

    if (username === "krishowner" && password === "owner") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      alert("Incorrect username or password!");
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Render nothing if not authenticated
  }

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...u, name, email } : u));
      setEditId(null);
    } else {
      setUsers([...users, { id: Date.now(), name, email }]);
    }
    setName("");
    setEmail("");
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f6f2" }}>
      <AdminSidebar admin={admin} onLogout={handleLogout} ownerName={ownerName} />
      <main style={{ marginLeft: 260, flex: 1, padding: "3rem 2rem" }}>
        <h2 style={{ color: "#2d2540", fontSize: "2rem", marginBottom: "2rem" }}>Admin Main Landing Page</h2>
      </main>
    </div>
  );
};

export default Admin_Page;
