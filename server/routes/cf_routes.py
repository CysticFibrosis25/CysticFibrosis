from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cf_profile import CFProfile
from models.user import User



cf_bp = Blueprint("cf", __name__)

from flask_cors import CORS
CORS(cf_bp)

cf_model = CFProfile()
user_model = User()

# CREATE / UPDATE CF PROFILE
@cf_bp.route("/cf", methods=["POST","OPTIONS"])      
def save_or_update_cf_profile():
    
    if request.method=="OPTIONS":
     return jsonify({"status": "ok"}), 200
    
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email User is not found"}), 400
        # Basic validation (minimal, UI already validates more)
    if not data.get("cf_type"):
        return jsonify({"message": "CF type is required"}), 400

    # Upsert CF profile
    cf_model.upsert_cf_profile(email, data)

    # Mark onboarding complete (safe to call multiple times)
    user_model.mark_onboarding_complete(email=email)

    return jsonify({
        "message": "CF profile saved successfully"
    }), 200
    
# UPDATE CF PROFILE (EDIT)
@cf_bp.route("/cf", methods=["PUT", "OPTIONS"])
def update_cf_profile():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    # Remove email from payload
    data.pop("email", None)

    cf_model.update_cf_profile(email, data)

    return jsonify({
        "message": "CF profile updated successfully"
    }), 200

    

# FETCH CF PROFILE (FOR PROFILE DISPLAY / PREFILL)
@cf_bp.route("/cf", methods=["GET", "OPTIONS"])
def get_cf_profile():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    email = request.args.get("email")

    if email:
        user = user_model.get_user_details(email)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    cf_profile = cf_model.get_cf_profile(email)

    if not cf_profile:
        return jsonify({}), 200  # Empty if not filled yet

    return jsonify(cf_profile), 200
