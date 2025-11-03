import React from "react";
import PropTypes from "prop-types";
import JobCard from "./JobCard";

function JobList({ jobs, onJobClick }) {
  if (!jobs || jobs.length === 0) {
    return <p>No jobs available.</p>;
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} onClick={onJobClick} />
      ))}
    </div>
  );
}

JobList.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  onJobClick: PropTypes.func.isRequired,
};

export default JobList;
