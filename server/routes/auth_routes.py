from flask import Blueprint, request, jsonify
from models.user import User
from flask_cors import CORS

# JWT (Option 2)
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

auth_bp = Blueprint("auth", __name__)
user_model = User()

CORS(auth_bp)


# SIGNUP — STEP 1 (LOGIN + EMERGENCY CONTACT)
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password required"}), 400

    if user_model.get_user_details(data["email"]):
        return jsonify({"message": "Email already registered."}), 409

    user_model.create_user(data)

    return jsonify({
        "message": "Signup successful! Proceed to onboarding."
    }), 201


# LOGIN — JWT BASED (Option 2)
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = user_model.get_user_details(email)

    if not user:
        return jsonify({"message": "User not found."}), 404

    if not user_model.verify_password(user["password"], password):
        return jsonify({"message": "Incorrect password."}), 401

    access_token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "message": "Login successful!",
        "onboarding_completed": user.get("onboarding_completed", False),
        "user": {
            "name": user.get("name"),
            "email": user.get("email")
        }
    }), 200


# USER DETAILS — PROFILE FETCH (LEGACY + JWT SAFE)
@auth_bp.route("/user/details", methods=["GET"])
def get_user_details():
    email = request.args.get("email")
    if not email:
        return jsonify({"message": "Email is required."}), 400

    user=user_model.get_user_details(email)

    if not user:
        return jsonify({"message": "User not found."}), 404

    return jsonify({
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "profile_image": user.get("profile_image", ""),
        "reminders": user.get("reminders", []),
        "emergency_contact": user.get("emergency_contact", {}),
        "onboarding_completed": user.get("onboarding_completed", False)
    }), 200

# USER UPDATE — GENERIC PROFILE UPDATE (LEGACY SAFE)
@auth_bp.route("/user/update", methods=["PUT"])
def update_user():

    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email missing"}), 400

    user_model.update_user(email, data)
    if any(key in data for key in ["cf_type", "dob", "sex"]):
        user_model.mark_onboarding_complete(email=email)

    return jsonify({"message": "User updated successfully!"}), 200


#  UPDATE (PROFILE EDIT)
# @auth_bp.route("/user/update", methods=["PUT"])
# def update_user():
#     data = request.json
#     email = data.get("email")

#     if not email:
#         return jsonify({"message": "Email is required"}), 400

#     # Remove email from update payload
#     data.pop("email", None)

#     user_model.update_user(
#         email=email,
#         data=data
#     )

#     return jsonify({"message": "User updated successfully"}), 200

@auth_bp.route("/user/reminders", methods=["POST"])
def add_reminder():
    data = request.json
    email = data.get("email")
    reminder = data.get("reminder")

    if not email or not reminder or not reminder.get("text") or not reminder.get("time"):
        return jsonify({"message": "Email and reminder text & time required"}), 400

    user_model.add_reminder(email, reminder)
    return jsonify({"message": "Reminder added successfully!"}), 201



# REMINDERS — DELETE
@auth_bp.route("/user/reminders", methods=["DELETE"])
def delete_reminder():
    email = request.json.get("email")
    reminder = request.json.get("reminder")

    if not email or not reminder:
        return jsonify({"message": "Email and reminder required"}), 400

    user_model.delete_reminder(email, reminder)
    return jsonify({"message": "Reminder deleted successfully!"}), 200
