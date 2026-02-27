from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.health_profile import HealthProfile
from models.cf_profile import CFProfile
from datetime import date

profile_bp = Blueprint("profile", __name__)

user_model = User()
health_model = HealthProfile()
cf_model = CFProfile()

# GET FULL PROFILE (3 MODULES)
@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_full_profile():

    user_id = get_jwt_identity()

    # FETCH CORE USER
    user = user_model.get_user_by_id(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # FETCH HEALTH PROFILE
    health_profile = health_model.get_health_profile(user_id)

    # Compute age from DOB
    age = None
    if health_profile and health_profile.get("dob"):
        dob = health_profile["dob"]
        today = date.today()
        age = today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )

    # FETCH CF PROFILE
    cf_profile = cf_model.get_cf_profile(user_id)


    # BUILD RESPONSE (3 BOXES)
    response = {
        "login_emergency": {
            "name": user.get("name"),
            "email": user.get("email"),
            "emergency_contact": user.get("emergency_contact", {}),
            "onboarding_completed": user.get("onboarding_completed", False)
        },

        "health_dietary": {
            **health_profile,
            "age": age
        } if health_profile else {},

        "cf_specific": cf_profile if cf_profile else {}
    }

    return jsonify(response), 200
