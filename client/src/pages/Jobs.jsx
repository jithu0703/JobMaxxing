import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JobList from "../components/JobList";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [likedJobIds, setLikedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndLikes = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch jobs
        const jobsRes = await axios.get("http://localhost:5000/jobs", { headers });
        const jobsData = jobsRes.data.jobs || [];

        // Fetch liked job IDs if logged in
        let likedIdsSet = new Set();
        if (token) {
          const likesRes = await axios.get("http://localhost:5000/user/liked_jobs", { headers });
          likedIdsSet = new Set(likesRes.data.liked_job_ids || []);
        }

        setJobs(jobsData);
        setLikedJobIds(likedIdsSet);
      } catch (err) {
        setError("Failed to load jobs or likes.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndLikes();
  }, []);

  const handleJobClick = (jobId) => navigate(`/job/${jobId}`);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Pass isLikedByUser flag for each job
  const jobsWithLikeFlag = jobs.map((job) => ({
    ...job,
    isLikedByUser: likedJobIds.has(job.job_id),
  }));

  return <JobList jobs={jobsWithLikeFlag} onJobClick={handleJobClick} />;
}

export default JobsPage;
