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
  const [isAdmin, setIsAdmin] = useState(false); // Replace with real admin check

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`http://localhost:5000/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJob(res.data.job);
        setFormData(res.data.job);

        // Simple admin check example - adjust as per your auth logic
        const userRole = parseJwt(token)?.role;
        setIsAdmin(userRole === "admin");
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
    if (job.applyUrl) {
      window.open(job.applyUrl, "_blank", "noopener noreferrer");
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:5000/jobs/${jobId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJob(formData);
      setEditing(false);
    } catch {
      alert("Failed to update job");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1); // Go back after deletion
    } catch {
      alert("Failed to delete job");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading job details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="job-page-container">
      {editing ? (
        <div className="job-edit-form">
      <label>
      Title
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="input-field"
      />
      </label>

      <label>
      Location
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="input-field"
      />
      </label>

      <label>
      Salary
      <input
        type="text"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        className="input-field"
      />
      </label>

      <label>
      Type
      <input
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="input-field"
      />
      </label>

      <label>
      Description
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="textarea-field"
        rows={6}
      />
      </label>

      <label>
      Apply URL
      <input
        type="text"
        name="applyUrl"
        value={formData.applyUrl || ""}
        onChange={handleChange}
        className="input-field"
      />
      </label>

      <div className="edit-form-buttons">
        <button
        onClick={handleSave}
        disabled={loading}
        className="btn btn-primary"
        >
        Save
        </button>
        <button
          onClick={() => setEditing(false)}
          disabled={loading}
          className="btn btn-secondary"
        >
        Cancel
        </button>
      </div>
  </div>
      ) : (
        <>
          <h1 className="job-title">{job.title}</h1>
          <h3 className="company-name">{job.companyName}</h3>
          <div className="job-meta">
            <span>Location: {job.location || "N/A"}</span>
            <span>Type: {job.type || "N/A"}</span>
            <span>Salary: {job.salary || "N/A"}</span>
          </div>
          <div className="job-dates">
            <span>Posted: {job.postedDate}</span><br/>
            <span>Deadline: {job.deadline || "Open"}</span>
          </div>
          <div className="job-description">
            <h4>Job Description</h4>
            <p>{job.description}</p>
          </div>
          <button className="apply-button" onClick={handleApplyClick}>
            Apply Now
          </button>

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
