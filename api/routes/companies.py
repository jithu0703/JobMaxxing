from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Company, User
import jwt

company_bp = Blueprint("company", __name__)
SECRET_KEY = "jithendra/abhishek"

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

@company_bp.route('/companies', methods=['GET'])
def list_companies():
    companies = db.session.query(Company).all()
    result = []
    for c in companies:
        result.append({"company_id": c.company_id, "company_name": c.company_name})
    return jsonify({"companies": result})

@company_bp.route('/companies', methods=['POST'])
def create_company():
    verify_admin()
    data = request.get_json()
    if not data.get('company_name'):
        abort(400, description="company_name is required")

    company = Company(company_name=data['company_name'])
    db.session.add(company)
    db.session.commit()
    return jsonify({"message": "Company created", "company_id": company.company_id}), 201

@company_bp.route('/companies/<int:company_id>', methods=['PUT'])
def update_company(company_id):
    verify_admin()    
    company = Company.query.get_or_404(company_id)
    data = request.get_json()
    if 'company_name' in data:
        company.company_name = data['company_name']
        db.session.commit()
    return jsonify({"message": "Company updated"})

@company_bp.route('/companies/<int:company_id>', methods=['DELETE'])
def delete_company(company_id):
    verify_admin()    
    company = Company.query.get_or_404(company_id)
    db.session.delete(company)
    db.session.commit()
    return jsonify({"message": "Company deleted"})
