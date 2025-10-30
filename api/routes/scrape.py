# api/routes/scrape_routes.py
from flask import Blueprint, jsonify
from scraping.internshala import scrape_internshala

scrape_bp = Blueprint("scrape", __name__)

@scrape_bp.route("/scrape/internshala", methods=["GET"])
def scrape_internshala_route():
    try:
        result = scrape_internshala()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
