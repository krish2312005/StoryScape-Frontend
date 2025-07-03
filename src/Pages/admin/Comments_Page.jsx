import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const Comments_Page = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCommentData, setNewCommentData] = useState({
    content: '',
    story: '',
    user: ''
  });
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchComments();
    fetchStories();
    fetchUsers();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Failed to fetch comments');
      }
    } catch (error) {
      setError('Failed to fetch comments');
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`);
      if (response.ok) {
        const data = await response.json();
        setStories(data);
      } else {
        console.error("Failed to fetch stories");
      }
    } catch (error) {
      console.error("Error fetching stories", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleEdit = async (id) => {
    console.log(`Editing comment with id: ${id}`);
    const commentToEdit = comments.find((comment) => comment.id === id || comment._id === id);
    console.log(`Found comment to edit:`, commentToEdit);

    if (!commentToEdit) {
      console.error(`Comment with id ${id} not found.`);
      return;
    }

    const updatedContent = prompt("Edit comment content:", commentToEdit.content);
    if (updatedContent) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${commentToEdit._id || commentToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: updatedContent }),
        });
        if (response.ok) {
          const updatedComment = await response.json();
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentToEdit.id || comment._id === commentToEdit._id
                ? { ...comment, content: updatedComment.content }
                : comment
            )
          );
        } else {
          alert("Failed to update comment");
        }
      } catch (error) {
        alert("An error occurred while updating the comment");
      }
    }
  };

  const handleDelete = async (id) => {
    const commentToDelete = comments.find((comment) => comment.id === id || comment._id === id);
    if (!commentToDelete) {
      console.error(`Comment with id ${id} not found.`);
      return;
    }

    console.log(`Attempting to delete comment with id: ${id}`);
    console.log(`Deleting comment with id: ${id}`);
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
          setDeleteError('');
        } else {
          setDeleteError('Failed to delete comment. Delete operation does not work.');
        }
      } catch (error) {
        setDeleteError('An error occurred while deleting the comment.');
      }
    }
  };

  const handleCreate = async () => {
    if (!newCommentData.content || !newCommentData.story || !newCommentData.user) {
      alert("Please fill in all fields before creating a comment.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommentData),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setIsCreating(false);
        setNewCommentData({ content: "", story: "", user: "" });
      } else {
        alert("Failed to create comment");
      }
    } catch (error) {
      alert("An error occurred while creating the comment");
    }
  };

  const handleEditClick = (comment) => {
    setEditedComment({
      _id: comment._id,
      content: comment.content,
      story: comment.story._id,
      user: comment.user._id
    });
    setIsEditing(true);
  };

  const handleNewCommentChange = (e) => {
    const { name, value } = e.target;
    setNewCommentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedComment(null);
  };

  const handleSave = async () => {
    if (!editedComment) {
      console.error("No comment selected for editing.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${editedComment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedComment.content }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === editedComment._id ? { ...comment, content: updatedComment.content } : comment
          )
        );
        setIsEditing(false);
        setEditedComment(null);
      } else {
        alert("Failed to update comment");
      }
    } catch (error) {
      alert("An error occurred while saving the comment");
    }
  };

  const admin = {
    name: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const uniqueStories = Array.from(new Set(comments.map((comment) => comment.story?._id))).map((id) => {
    return comments.find((comment) => comment.story?._id === id)?.story;
  });

  const uniqueUsers = Array.from(new Set(comments.map((comment) => comment.user?._id))).map((id) => {
    return comments.find((comment) => comment.user?._id === id)?.user;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f6f2" }}>
      <AdminSidebar admin={admin} />
      <main style={{ marginLeft: 260, flex: 1, padding: "3rem 2rem" }}>
        {deleteError && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {deleteError}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#2d2540", fontSize: "2rem" }}>Manage Comments</h2>
          <button
            onClick={() => setIsCreating(true)}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2d2540",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>+</span>
            Add Comment
          </button>
        </div>

        {isEditing && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 2px 8px rgba(44, 37, 64, 0.06)",
              width: "90%",
              maxWidth: "500px"
            }}>
              <h3 style={{ color: "#2d2540", marginBottom: "1rem" }}>Edit Comment</h3>
              <form>
                <input
                  type="text"
                  name="content"
                  value={editedComment.content}
                  onChange={(e) => setEditedComment({ ...editedComment, content: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #edeaf3", marginBottom: "1rem" }}
                />
                <button
                  type="button"
                  onClick={handleSave}
                  style={{ padding: "0.75rem 1.5rem", background: "#2d2540", color: "#fff", border: "none", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginRight: "1rem" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ padding: "0.75rem 1.5rem", background: "#edeaf3", color: "#2d2540", border: "none", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {isCreating && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 2px 8px rgba(44, 37, 64, 0.06)",
              width: "90%",
              maxWidth: "500px"
            }}>
              <h3 style={{ color: "#2d2540", marginBottom: "1rem" }}>Create Comment</h3>
              <form>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#2d2540" }}>Content</label>
                <input
                  type="text"
                  name="content"
                  value={newCommentData.content}
                  onChange={handleNewCommentChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #edeaf3", marginBottom: "1rem" }}
                />
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#2d2540" }}>Story</label>
                <select
                  name="story"
                  value={newCommentData.story}
                  onChange={handleNewCommentChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #edeaf3", marginBottom: "1rem" }}
                >
                  {stories.map((story) => (
                    <option key={story._id} value={story._id}>
                      {story.title}
                    </option>
                  ))}
                </select>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "#2d2540" }}>User</label>
                <select
                  name="user"
                  value={newCommentData.user}
                  onChange={handleNewCommentChange}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #edeaf3", marginBottom: "1rem" }}
                >
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleCreate}
                  style={{ padding: "0.75rem 1.5rem", background: "#2d2540", color: "#fff", border: "none", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginRight: "1rem" }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{ padding: "0.75rem 1.5rem", background: "#edeaf3", color: "#2d2540", border: "none", borderRadius: "25px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          background: "#fff",
          borderRadius: "1rem",
          boxShadow: "0 2px 8px rgba(44, 37, 64, 0.06)",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ 
                background: "#f7f6f2",
                color: "#2d2540",
                textAlign: "left"
              }}>
                <th style={{ padding: "1rem" }}>Comment</th>
                <th style={{ padding: "1rem" }}>User</th>
                <th style={{ padding: "1rem" }}>Story</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, index) => (
                <tr key={`${comment.id}-${index}`} style={{ borderBottom: "1px solid #edeaf3" }}>
                  <td style={{ padding: "1rem" }}>{comment.content}</td>
                  <td style={{ padding: "1rem" }}>{comment.user?.username || "Unknown User"}</td>
                  <td style={{ padding: "1rem" }}>{comment.story?.title || "Unknown Story"}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditClick(comment)}
                        style={{
                          background: "#edeaf3",
                          color: "#2d2540",
                          border: "none",
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id || comment.id)}
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "1.5rem",
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.875rem"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Comments_Page;
