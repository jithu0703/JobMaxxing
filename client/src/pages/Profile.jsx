import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    resume_link: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  async function fetchUserProfile() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        resume_link: res.data.resume_link || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const res = await axios.put(
        "http://localhost:5000/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      setEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditing(false);
    setFormData({
      username: user.username,
      email: user.email,
      resume_link: user.resume_link || "",
    });
  }

  if (loading && !user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {user && (
          <>
            {!editing ? (
              <div className="profile-view">
                <div className="profile-field">
                  <label>Username:</label>
                  <p>{user.username}</p>
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-field">
                  <label>Resume Link:</label>
                  {user.resume_link ? (
                    <a href={user.resume_link} target="_blank" rel="noreferrer">
                      {user.resume_link}
                    </a>
                  ) : (
                    <p>No resume link added</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Role:</label>
                  <p>{user.role}</p>
                </div>
                <div className="profile-field">
                  <label>Member Since:</label>
                  <p>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  className="btn btn-edit"
                  onClick={() => setEditing(true)}
                  disabled={loading}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Resume Link:</label>
                  <input
                    type="url"
                    name="resume_link"
                    value={formData.resume_link}
                    onChange={handleChange}
                    placeholder="https://example.com/resume.pdf"
                    disabled={loading}
                  />
                </div>
                <div className="button-group">
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
