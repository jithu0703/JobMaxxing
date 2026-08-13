import React from "react";
import PropTypes from "prop-types";
import "../styles/JobCard.css";

function JobCard({ job, onClick }) {
  return (
    <div className="job-card" onClick={() => onClick(job.job_id)} style={{ cursor: "pointer" }}>
      <header className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <div className="company-name">{job.companyName}</div>
      </header>

      <div className="job-meta">
        <span className="job-location">{job.location || "Location TBA"}</span>
        <span className="job-salary">{job.salary || "Salary Not Disclosed"}</span>
        <span className="job-type">{job.type || "Full-time"}</span>
      </div>

      <div className="job-description">
        {job.description?.slice(0, 150)}...
      </div>
    </div>
  );
}

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default JobCard;
