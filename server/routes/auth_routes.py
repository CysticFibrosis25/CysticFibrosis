from flask import Blueprint, request, jsonify
from models.user import User

auth_bp = Blueprint('auth', __name__)
user_model = User()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if user_model.find_by_email(data["email"]):
        return jsonify({"message": "Email already registered."}), 409
    user_model.create_user(data)
    return jsonify({"message": "Signup successful!"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = user_model.find_by_email(data["email"])
    if not user:
        return jsonify({"message": "User not found."}), 404

    if not user_model.verify_password(user["password"], data["password"]):
        return jsonify({"message": "Incorrect password."}), 401

    return jsonify({
        "message": "Login successful!",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "age": user["age"],
            "height": user["height"],
            "weight": user["weight"]
        }
    }), 200