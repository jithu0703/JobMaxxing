from flask import Blueprint, request, jsonify
from models import db, User
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)
SECRET_KEY = "jithendra/abhishek"

# Signup
@auth_bp.route("/users", methods=["POST"])
def signup():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No input data provided"}), 400

    # Accept both 'username' or 'name' (in case frontend mismatch)
    name = data.get("name") or data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")
    resume_link = data.get("resume_link")

    if not all([name, email, password]):
        return jsonify({"message": "Missing required fields"}), 400

    # Check existing user
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    # Create new user
    user = User(username=name, email=email, role=role, resume_link=resume_link)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful!"}), 201

# Login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        # Create JWT token
        token = jwt.encode({
            'user_id': user.user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            'message': 'Login successful!',
            'token': token
        })
    return jsonify({'message': 'Invalid email or password'}), 401
