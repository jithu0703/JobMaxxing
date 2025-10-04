from flask import Blueprint, jsonify
from scraping.internshala import scrape_internshala

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/jobs", methods=["GET"])
def get_jobs():
    try:
        jobs = scrape_internshala()
        return jsonify(jobs)
    except Exception as e:
        # Log error and return JSON error response
        print("Error while scraping:", str(e))
        return jsonify({"error": str(e)}), 500
