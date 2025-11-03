import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/JobPage.css";

function JobPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch {
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (loading) return <div>Loading job details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="job-details container">
      <h1>{job.title}</h1>
      <h3>{job.companyName}</h3>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Description:</strong></p>
      <p style={{whiteSpace:"pre-line"}}>{job.description}</p>
    </div>
  );
}

export default JobPage;
