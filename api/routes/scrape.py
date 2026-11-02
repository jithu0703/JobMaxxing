# api/routes/scrape_routes.py
from flask import Blueprint, jsonify
from scraping.internshala import scrape_internshala

scrape_bp = Blueprint("scrape", __name__)

@scrape_bp.route("/scrape/python", methods=["GET", "POST"])
def scrape_python():
    result = scrape_internshala("python-internship", 5)
    return jsonify(result)

@scrape_bp.route("/scrape/webdev", methods=["GET", "POST"])
def scrape_webdev():
    result = scrape_internshala("software-development-internship", 5)
    return jsonify(result)

@scrape_bp.route("/scrape/internships", methods=["GET", "POST"])
def scrape_internships():
    result = scrape_internshala("internships", 5)
    return jsonify(result)