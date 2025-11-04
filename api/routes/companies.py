from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Company, User

company_bp = Blueprint("company", __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

@company_bp.route('/companies', methods=['GET'])
def list_companies():
    companies = db.session.query(Company).all()
    result = []
    for c in companies:
        result.append({"company_id": c.company_id, "company_name": c.company_name})
    return jsonify({"companies": result})

@company_bp.route('/companies', methods=['POST'])
@jwt_required()
def create_company():
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        abort(403)
    data = request.get_json()
    if not data.get('company_name'):
        abort(400, description="company_name is required")

    company = Company(company_name=data['company_name'])
    db.session.add(company)
    db.session.commit()
    return jsonify({"message": "Company created", "company_id": company.company_id}), 201

@company_bp.route('/companies/<int:company_id>', methods=['PUT'])
@jwt_required()
def update_company(company_id):
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        abort(403)
    company = Company.query.get_or_404(company_id)
    data = request.get_json()
    if 'company_name' in data:
        company.company_name = data['company_name']
        db.session.commit()
    return jsonify({"message": "Company updated"})

@company_bp.route('/companies/<int:company_id>', methods=['DELETE'])
@jwt_required()
def delete_company(company_id):
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        abort(403)
    company = Company.query.get_or_404(company_id)
    db.session.delete(company)
    db.session.commit()
    return jsonify({"message": "Company deleted"})
