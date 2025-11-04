from flask import Blueprint, request, jsonify
import jwt
from models import User
from token_auth import token_required
from models import User
from flask_jwt_extended import jwt_required, get_jwt_identity
dashboard_bp = Blueprint('dashboard', __name__)
SECRET_KEY = "jithendra/abhishek"


@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({
        'message': f'Welcome {user.username}!',
        'email': user.email
    })

