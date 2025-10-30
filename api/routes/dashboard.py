from flask import Blueprint, request, jsonify
import jwt
from models import User
from token_auth import token_required
dashboard_bp = Blueprint('dashboard', __name__)
SECRET_KEY = "jithendra/abhishek"

@dashboard_bp.route('/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    return jsonify({
        'message': f'Welcome {current_user.username}!',
        'email': current_user.email
    })
