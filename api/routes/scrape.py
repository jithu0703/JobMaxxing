# api/routes/scrape_routes.py
from flask import Blueprint, jsonify
from scraping.internshala import scrape_internshala

scrape_bp = Blueprint("scrape", __name__)

@scrape_bp.route("/scrape/internshala", methods=["GET", "POST"])
def scrape_internshala_trial():
    result = scrape_internshala()
    return jsonify(result)
