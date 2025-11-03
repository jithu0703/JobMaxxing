from flask import Blueprint, jsonify
from models import db, Job, Company

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/jobs", methods=["GET"])
def get_jobs():
    try:
        # Query all jobs with companies joined
        jobs = db.session.query(Job, Company).join(Company, Job.company_id == Company.company_id).all()

        jobs_list = []
        for job, company in jobs:
            jobs_list.append({
                "job_id": job.job_id,
                "title": job.title,
                "location": job.location,
                "salary": job.salary,
                "type": job.type,
                "postedDate": job.posted_date.isoformat() if job.posted_date else None,
                "deadline": job.deadline.isoformat() if job.deadline else None,
                "description": job.description,
                "companyName": company.company_name,
            })

        return jsonify({"jobs": jobs_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@jobs_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    job = db.session.query(Job, Company).join(Company, Job.company_id == Company.company_id)\
        .filter(Job.job_id == job_id).first()
    if not job:
        return jsonify({"error": "Job Not Found"}), 404
    job_obj, company = job
    job_data = {
        "job_id": job_obj.job_id,
        "title": job_obj.title,
        "location": job_obj.location,
        "salary": job_obj.salary,
        "type": job_obj.type,
        "postedDate": job_obj.posted_date.isoformat() if job_obj.posted_date else None,
        "deadline": job_obj.deadline.isoformat() if job_obj.deadline else None,
        "description": job_obj.description,
        "companyName": company.company_name
    }
    return jsonify({"job": job_data})