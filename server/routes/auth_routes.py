from flask import Blueprint, request, jsonify
from models.user import User    
from flask_cors import CORS

auth_bp = Blueprint('auth', __name__)
user_model = User()

CORS(auth_bp)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if user_model.get_user_details(data["email"]):
        return jsonify({"message": "Email already registered."}), 409
    user_model.create_user(data)
    return jsonify({"message": "Signup successful!"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = user_model.get_user_details(data["email"])
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
            "sex":user["sex"],
            "height": user["height"],
            "weight": user["weight"]
        }
    }), 200
    
@auth_bp.route('/user/details', methods=['GET'])
def get_user_details():
    email = request.args.get('email')  
    user = user_model.get_user_details(email)
    if not user:
        return jsonify({"message": "User  not found."}), 404
    return jsonify({
        "name": user["name"],
        "email": user["email"],
        "sex":user["sex"],
        "phone": user["phone"],
        "age": user["age"],
        "height": user["height"],
        "weight": user["weight"],
        "reminders": user.get("reminders", [])
    }), 200

@auth_bp.route('/user/update', methods=['PUT'])
def update_user():
    email = request.json.get("email")
    updated_data = request.json
    user_model.update_user(email, updated_data)
    return jsonify({"message": "User  updated successfully!"}), 200

@auth_bp.route('/user/reminders', methods=['POST'])
def add_reminder():
    email = request.json.get("email")
    reminder = request.json.get("reminder")
    user_model.add_reminder(email, reminder)
    return jsonify({"message": "Reminder added successfully!"}), 201

@auth_bp.route('/user/reminders', methods=['DELETE'])
def delete_reminder():
    email = request.json.get("email")
    reminder = request.json.get("reminder")
    user_model.delete_reminder(email, reminder)
    return jsonify({"message": "Reminder deleted successfully!"}), 200
