import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/JobPage.css";

function JobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`http://localhost:5000/jobs/${jobId}`, { headers });
        const jobData = res.data.job;
        setJob(jobData);
        setFormData({ ...jobData });
        // Check admin role
        const userRole = parseJwt(token)?.role;
        setIsAdmin(userRole === "admin");
        // Set liked state
        setLiked(jobData.isLikedByUser || false);
      } catch {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  function parseJwt(token) {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  const handleApplyClick = () => {
    if (job?.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener noreferrer");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:5000/jobs/${jobId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setJob(formData);
      setEditing(false);
    } catch {
      alert("Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
      navigate(-1);
    } catch {
      alert("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to like jobs.");
      return;
    }
    try {
      if (!liked) {
        await axios.post(`http://localhost:5000/jobs/${jobId}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setLiked(true);
      } else {
        await axios.delete(`http://localhost:5000/jobs/${jobId}/like`, { headers: { Authorization: `Bearer ${token}` } });
        setLiked(false);
      }
    } catch {
      alert("Failed to update like status.");
    }
  };

  if (loading) return <div>Loading job details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="job-page-container">
      {/* Like Button */}
      <button
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={handleLikeToggle}
        aria-label={liked ? "Unlike job" : "Like job"}
      >
        {liked ? "♥ Liked" : "♡ Like"}
      </button>

      {editing ? (
        <div className="job-edit-form">
          {/* Editable form fields */}
          {/* Title */}
          <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" />
          </label>
          {/* Location */}
          <label>
            Location
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" />
          </label>
          {/* Salary */}
          <label>
            Salary
            <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="input-field" />
          </label>
          {/* Type */}
          <label>
            Type
            <input type="text" name="type" value={formData.type} onChange={handleChange} className="input-field" />
          </label>
          {/* Description */}
          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} className="textarea-field" rows={6} />
          </label>
          {/* Apply URL */}
          <label>
            Apply URL
            <input type="text" name="applyUrl" value={formData.applyUrl || ""} onChange={handleChange} className="input-field" />
          </label>
          {/* Save/Cancel Buttons */}
          <div className="edit-form-buttons">
            <button onClick={handleSave} disabled={loading} className="btn btn-primary">Save</button>
            <button onClick={() => setEditing(false)} disabled={loading} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          {/* Job Display */}
          <h1 className="job-title">{job.title}</h1>
          <h3 className="company-name">{job.companyName}</h3>
          <div className="job-meta">
            <span>Location: {job.location || "N/A"}</span>
            <span>Type: {job.type || "N/A"}</span>
            <span>Salary: {job.salary || "N/A"}</span>
          </div>
          <div className="job-dates">
            <span>Posted: {job.postedDate}</span>
            <br />
            <span>Deadline: {job.deadline || "Open"}</span>
          </div>
          <div className="job-description">
            <h4>Job Description</h4>
            <p>{job.description}</p>
          </div>
          <button className="apply-button" onClick={handleApplyClick}>Apply Now</button>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="job-admin-actions">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete} disabled={loading}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobPage;
