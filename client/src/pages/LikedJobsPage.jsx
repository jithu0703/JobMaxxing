import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobList from "../components/JobList";

function LikedJobsPage() {
  const [likedJobs, setLikedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedJobs = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view liked jobs.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/user/liked_jobs/full", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedJobs(res.data.liked_jobs || []);
      } catch (err) {
        setError("Failed to fetch liked jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedJobs();
  }, []);

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) return <div>Loading liked jobs...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>Liked Jobs</h1>
      {likedJobs.length === 0 ? (
        <p>You have not liked any jobs yet.</p>
      ) : (
        <JobList jobs={likedJobs} onJobClick={handleJobClick} />
      )}
    </div>
  );
}

export default LikedJobsPage;
