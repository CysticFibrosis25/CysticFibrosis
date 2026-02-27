from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.health_profile import HealthProfile
from models.user import User
from datetime import datetime



health_bp = Blueprint("health", __name__)

from flask_cors import CORS
CORS(health_bp)

health_model = HealthProfile()
user_model = User()

# CREATE / UPDATE HEALTH PROFILE
@health_bp.route("/health", methods=["POST", "OPTIONS"])
def save_or_update_health_profile():
    if request.method == "OPTIONS":
     return jsonify({"status": "ok"}), 200

    data=request.json
    email=data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400

    if not data.get("dob"):
        return jsonify({"message": "Date of birth is required"}), 400

    if not data.get("sex"):
        return jsonify({"message": "Sex is required"}), 400

    dob = data.get("dob")
    if isinstance(dob, str):
        try:
            dob = datetime.strptime(dob, "%Y-%m-%d").date()
        except Exception:
            return jsonify({"message": "Invalid DOB format"}), 400

    health_payload = {
        "email": email,
        "dob": dob,
        "sex": data.get("sex"),
        "height": data.get("height"),
        "weight": data.get("weight"),
        "allergies": data.get("allergies", [])
    }
    health_model.upsert_health_profile(email, health_payload)

    return jsonify({
        "message": "Health profile saved successfully"
    }), 200


@health_bp.route("/health", methods=["PUT", "OPTIONS"])
def update_health_profile():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email is required"}), 400

    # Remove email from payload
    data.pop("email", None)

    health_model.update_health_profile(email, data)

    return jsonify({
        "message": "CF profile updated successfully"
    }), 200
    
# FETCH HEALTH PROFILE
@health_bp.route("/health", methods=["GET", "OPTIONS"])
def get_health_profile():

    if request.method == "OPTIONS":
     return jsonify({"status": "ok"}), 200
    email=request.args.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    health_profile = health_model.get_health_profile(email)

    if not health_profile:
        return jsonify({}), 200

    return jsonify(health_profile), 200
