import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobList from "../components/JobList";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5000/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  function handleJobClick(jobId) {
    navigate(`/job/${jobId}`);
  }

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return <JobList jobs={jobs} onJobClick={handleJobClick} />;
}

export default JobsPage;
