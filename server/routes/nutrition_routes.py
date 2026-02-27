from flask import Blueprint, request, jsonify
from datetime import datetime
from database.db import db

nutrition_bp = Blueprint("nutrition", __name__)
from flask_cors import CORS
CORS(nutrition_bp)
# -----------------------------
# Helpers
# -----------------------------

def default_nutrition_profile(email):
    return {
        "email": email,
        "daily_calorie_target": None,

        # Diet & planning
        "dietary_preferences": [],     # vegetarian, vegan, keto, paleo, gluten_free
        "food_allergies": [],

        "meals_per_day": 3,            # breakfast, lunch, dinner (+ snacks inferred)

        # Meta
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

# -----------------------------
# CREATE / UPSERT
# -----------------------------

@nutrition_bp.route("/nutrition", methods=["POST", "OPTIONS"])
def create_or_update_nutrition():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email required"}), 400

    if "daily_calorie_target" not in data:
        return jsonify({"error": "Daily calorie target is required"}), 400

    existing = db.nutrition_profiles.find_one({"email": email})
    profile = existing or default_nutrition_profile(email)

    # Mandatory
    profile["daily_calorie_target"] = int(data["daily_calorie_target"])

    # Optional (safe defaults)
    profile["dietary_preferences"] = data.get(
        "dietary_preferences",
        profile.get("dietary_preferences", [])
    )

    profile["food_allergies"] = data.get(
        "food_allergies",
        profile.get("food_allergies", [])
    )

    profile["meals_per_day"] = int(
        data.get("meals_per_day", profile.get("meals_per_day", 3))
    )

    profile["updated_at"] = datetime.utcnow()

    db.nutrition_profiles.update_one(
        {"email": email},
        {"$set": profile},
        upsert=True
    )

    return jsonify({
        "message": "Nutrition profile saved successfully",
        "note": "You can update this weekly or as advised by your doctor."
    }), 200


# -----------------------------
# FETCH PROFILE
# -----------------------------

@nutrition_bp.route("/nutrition", methods=["GET"])
def get_nutrition():
    email = request.args.get("email", "").strip()
    if not email:
        return jsonify({"error": "Email required"}), 400

    profile = db.nutrition_profiles.find_one(
        {"email": email},
        {"_id": 0}
    ) or {}

    # Backward compatibility cleanup
    profile.pop("cuisine_preferences", None)
    profile.pop("allow_snacks", None)
    profile.pop("snacks_per_day", None)

    # Defaults if missing
    profile.setdefault("dietary_preferences", [])
    profile.setdefault("food_allergies", [])
    profile.setdefault("meals_per_day", 3)

    return jsonify(profile), 200


# -----------------------------
# PARTIAL UPDATE (weekly tweaks)
# -----------------------------

@nutrition_bp.route("/nutrition", methods=["PUT", "OPTIONS"])
def update_nutrition():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email required"}), 400

    update_fields = {}

    allowed_fields = [
        "daily_calorie_target",
        "dietary_preferences",
        "food_allergies",
        "meals_per_day"
    ]

    for field in allowed_fields:
        if field in data:
            update_fields[field] = data[field]

    if not update_fields:
        return jsonify({"error": "No valid fields to update"}), 400

    update_fields["updated_at"] = datetime.utcnow()

    db.nutrition_profiles.update_one(
        {"email": email},
        {"$set": update_fields}
    )

    return jsonify({
        "message": "Nutrition profile updated successfully"
    }), 200
