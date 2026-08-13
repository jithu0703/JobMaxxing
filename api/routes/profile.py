from flask import Blueprint, request, jsonify, abort
from models import User, db
import jwt

profile_bp = Blueprint('profile', __name__)
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

@profile_bp.route('/profile', methods=['GET'])
def get_profile():
    user_id  = verify_user()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'resume_link': user.resume_link,
        'role': user.role,
        'created_at': user.created_at.isoformat()
    })


@profile_bp.route('/profile', methods=['PUT'])
def update_profile():
    user_id  = verify_user()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json()
    
    # Validate and update username
    if 'username' in data and data['username'].strip():
        if data['username'] != user.username:
            # Check if new username already exists
            if User.query.filter_by(username=data['username']).first():
                return jsonify({"message": "Username already taken"}), 400
        user.username = data['username']
    
    # Validate and update email
    if 'email' in data and data['email'].strip():
        if data['email'] != user.email:
            # Check if new email already exists
            if User.query.filter_by(email=data['email']).first():
                return jsonify({"message": "Email already in use"}), 400
        user.email = data['email']
    
    # Update resume link
    if 'resume_link' in data:
        user.resume_link = data['resume_link'] or None
    
    try:
        db.session.commit()
        return jsonify({
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'resume_link': user.resume_link,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update profile"}), 500
