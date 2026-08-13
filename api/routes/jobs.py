from flask import Blueprint, jsonify
from models import db, Job, Company, User
from flask_jwt_extended import jwt_required, get_jwt_identity
import jwt
from flask import request, jsonify, abort

jobs_bp = Blueprint("jobs", __name__)
SECRET_KEY = "jithendra/abhishek"

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
                "applyUrl": job.apply_url
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
        "companyName": company.company_name,
        "applyUrl": job_obj.apply_url
    }
    return jsonify({"job": job_data})

def verify_admin():
    auth_header = request.headers.get('Authorization', None)
    if not auth_header:
        abort(401)
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if payload.get('role') != 'admin':
            abort(403)
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        abort(401, description="Token expired")
    except jwt.InvalidTokenError:
        abort(401, description="Invalid token")

@jobs_bp.route('/jobs/<int:job_id>', methods=['PUT'])
def edit_job(job_id):
    verify_admin()
    data = request.get_json()
    job = Job.query.get_or_404(job_id)

    job.title = data.get('title', job.title)
    job.location = data.get('location', job.location)
    job.salary = data.get('salary', job.salary)
    job.type = data.get('type', job.type)
    job.description = data.get('description', job.description)
    job.apply_url = data.get('apply_url', job.apply_url)

    db.session.commit()
    return jsonify({"message": "Job updated successfully"})

@jobs_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    verify_admin()
    job = Job.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted successfully"})
