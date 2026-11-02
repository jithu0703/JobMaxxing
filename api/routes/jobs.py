from flask import Blueprint, jsonify
from models import db, Job, Company, User
from flask_jwt_extended import jwt_required, get_jwt_identity
import jwt
from flask import request, jsonify, abort

jobs_bp = Blueprint("jobs", __name__)
SECRET_KEY = "jithendra/abhishek"

def verify_user():
    auth_header = request.headers.get('Authorization', None)
    if not auth_header:
        abort(401)
    token = auth_header.split(" ")[1]
    if not token:
        abort(403)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        abort(401, description="Token expired")
    except jwt.InvalidTokenError:
        abort(401, description="Invalid token")

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
    job = Job.query.get_or_404(job_id)
    user_id = verify_user()
    
    liked = False
    if user_id:
        user = User.query.get(user_id)
        if user and job in user.liked_jobs:
            liked = True

    job_data = {
        'job_id': job.job_id,
        'title': job.title,
        'companyName': job.company.company_name if job.company else '',
        'location': job.location,
        'salary': job.salary,
        'type': job.type,
        'description': job.description,
        'applyUrl': job.apply_url,
        'postedDate': job.posted_date.isoformat() if job.posted_date else None,
        'deadline': job.deadline.isoformat() if job.deadline else None,
        'isLikedByUser': liked
    }
    return jsonify({'job': job_data})

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

@jobs_bp.route("/jobs/<int:job_id>/like", methods=['POST'])
def like_job(job_id):
    user_id = verify_user()
    user = User.query.get(user_id)
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"msg": "Job not found"}), 404
    if job in user.liked_jobs:
        return jsonify({"msg": "Job already liked"}), 400
    user.liked_jobs.append(job)
    db.session.commit()
    return jsonify({"msg": "Job liked successfully"}), 200

@jobs_bp.route("/jobs/<int:job_id>/like", methods=['DELETE'])
def unlike_job(job_id):
    user_id = verify_user()
    user = User.query.get(user_id)
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"msg": "Job not found"}), 404
    if job not in user.liked_jobs:
        return jsonify({"msg": "Job not liked yet"}), 400
    user.liked_jobs.remove(job)
    db.session.commit()
    return jsonify({"msg": "Job unliked successfully"}), 200

@jobs_bp.route("/user/liked_jobs", methods=["GET"])
def get_liked_jobs():
    user_id = verify_user()
    user = User.query.get(user_id)
    liked_job_ids = [job.job_id for job in user.liked_jobs]
    return jsonify({"liked_job_ids": liked_job_ids}), 200

@jobs_bp.route("/user/liked_jobs/full", methods=["GET"])
def get_liked_jobs_full():
    user_id = verify_user()
    user = User.query.get(user_id)
    liked_jobs = user.liked_jobs  # List of Job objects

    # Serialize jobs info as needed
    jobs_data = [
        {
            "job_id": j.job_id,
            "title": j.title,
            "companyName": j.company.company_name if j.company else "",
            "location": j.location,
            "salary": j.salary,
            "type": j.type,
            "description": j.description,
            "isLikedByUser": True
        }
        for j in liked_jobs
    ]

    return jsonify({"liked_jobs": jobs_data}), 200
