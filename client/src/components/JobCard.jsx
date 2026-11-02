import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../styles/JobCard.css";

function JobCard({ job, onClick }) {
  const [liked, setLiked] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (job.isLikedByUser) {
      setLiked(true);
    }
  }, [job.isLikedByUser]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert("Please log in to like jobs.");
      return;
    }

    try {
      if (!liked) {
        await axios.post(
          `http://localhost:5000/jobs/${job.job_id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLiked(true);
      } else {
        await axios.delete(`http://localhost:5000/jobs/${job.job_id}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked(false);
      }
    } catch (error) {
      alert("Failed to update like status. Please try again.");
    }
  };

  return (
    <div
      className="job-card"
      onClick={() => onClick(job.job_id)}
      style={{ cursor: "pointer" }}
    >
      <header className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <div className="company-name">{job.companyName}</div>
      </header>

      <div className="job-meta">
        <span className="job-location">{job.location || "Location TBA"}</span>
        <span className="job-salary">{job.salary || "Salary Not Disclosed"}</span>
        <span className="job-type">{job.type || "Full-time"}</span>
      </div>

      <div className="job-description">{job.description?.slice(0, 150)}...</div>

      <button
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={handleLikeClick}
        aria-label={liked ? "Unlike job" : "Like job"}
      >
        {liked ? "♥ Liked" : "♡ Like"}
      </button>
    </div>
  );
}

JobCard.propTypes = {
  job: PropTypes.shape({
    job_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    location: PropTypes.string,
    salary: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    isLikedByUser: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default JobCard;
