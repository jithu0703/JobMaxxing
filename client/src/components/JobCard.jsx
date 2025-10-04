import React from "react";

function JobCard({ job }) {
  if (!job) return null;

  return (
    <div className="job-card border rounded-lg shadow p-4 mb-4 hover:shadow-lg transition">
      {/* Job title and company */}
      <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
      <p className="text-gray-600 mb-2">{job.company}</p>

      {/* Location, stipend, duration */}
      <div className="flex flex-wrap gap-4 text-gray-700 mb-2">
        {job.location && (
          <span>
            <strong>Location:</strong> {job.location}
          </span>
        )}
        {job.stipend && (
          <span>
            <strong>Stipend:</strong> {job.stipend}
          </span>
        )}
        {job.duration && (
          <span>
            <strong>Duration:</strong> {job.duration}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {job.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {job.description && (
        <p className="text-gray-800 mb-2 line-clamp-3">{job.description}</p>
      )}

      {/* Posted date and PPO */}
      <div className="flex justify-between items-center text-gray-500 text-sm">
        {job.posted && <span>Posted: {job.posted}</span>}
        {job.ppo && <span>{job.ppo}</span>}
      </div>

      {/* Apply button */}
      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Now
        </a>
      )}
    </div>
  );
}

export default JobCard;
