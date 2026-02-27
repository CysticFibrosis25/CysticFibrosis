from flask import Blueprint, request, jsonify
from datetime import datetime, date
from database.db import db
from models.enzyme_profile import EnzymeProfile

enzyme_bp = Blueprint("enzyme", __name__)
from flask_cors import CORS
CORS(enzyme_bp)
enzyme_model = EnzymeProfile()

# -----------------------------
# Helpers
# -----------------------------

def today_str():
    return date.today().isoformat()


def classify_meal(fat):
    if fat < 3:
        return "very_small_snack"
    if fat < 10:
        return "small_snack"
    return "meal"


# -----------------------------
# SAVE / UPDATE ENZYME PROFILE
# -----------------------------

@enzyme_bp.route("/enzyme/profile", methods=["POST", "OPTIONS"])
def save_enzyme_profile():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email required"}), 400

    mode = data.get("mode")
    max_units = data.get("max_units_per_meal")

    if mode not in ["fat", "weight"]:
        return jsonify({"error": "Mode must be 'fat' or 'weight'"}), 400

    if not max_units:
        return jsonify({"error": "Doctor-prescribed per-meal limit required"}), 400

    if mode == "fat" and not data.get("units_per_gram"):
        return jsonify({"error": "units_per_gram required for fat-based mode"}), 400

    if mode == "weight" and not data.get("units_per_kg"):
        return jsonify({"error": "units_per_kg required for weight-based mode"}), 400

    enzyme_model.upsert_profile(email, data)

    return jsonify({
        "message": "Enzyme guidance saved successfully",
        "note": (
            "This reflects your doctor's current recommendation. "
            "You can update it weekly or whenever advised."
        )
    }), 200


# -----------------------------
# FETCH ENZYME PROFILE
# -----------------------------

@enzyme_bp.route("/enzyme/profile", methods=["GET"])
def get_enzyme_profile():
    email = request.args.get("email", "").strip()
    if not email:
        return jsonify({"error": "Email required"}), 400

    profile = enzyme_model.get_profile(email)
    return jsonify(profile or {}), 200


# -----------------------------
# ESTIMATE ENZYMES (PER GROUP)
# -----------------------------

@enzyme_bp.route("/enzyme/estimate", methods=["POST"])
def estimate_enzymes():
    data = request.json or {}
    email = data.get("email", "").strip()
    meal_fat = data.get("meal_fat")
    group_type = data.get("group_type", "meal")  # breakfast / lunch / snack_1

    if not email or meal_fat is None:
        return jsonify({"error": "Email and meal_fat required"}), 400

    # 🔒 Only today is editable
    if data.get("date") and data["date"] != today_str():
        return jsonify({
            "message": "Past days are locked. Enzyme estimates are shown for reference only."
        }), 403

    profile = enzyme_model.get_profile(email)
    if not profile:
        return jsonify({
            "message": "Enzyme guidance not set yet. Please add your doctor's recommendation."
        }), 400

    meal_fat = float(meal_fat)
    classification = classify_meal(meal_fat)

    # -----------------------------
    # VERY SMALL SNACK
    # -----------------------------
    if classification == "very_small_snack":
        return jsonify({
            "classification": classification,
            "recommended_lipase_units": 0,
            "message": (
                "This appears to be a very low-fat snack. "
                "Enzymes are usually not needed."
            ),
            "note": "This is a supportive estimate and does not replace medical advice."
        }), 200

    # -----------------------------
    # LOAD WEIGHT (safety)
    # -----------------------------
    health = db.health_profiles.find_one({"email": email})
    if not health or not health.get("weight"):
        return jsonify({"error": "Weight missing in health profile"}), 400

    weight = float(health["weight"])
    daily_safety_max = int(weight * 10000)

    # -----------------------------
    # PRIMARY CALCULATION
    # -----------------------------
    recommended_units = 0

    if profile["mode"] == "fat":
        recommended_units = int(meal_fat * profile["units_per_gram"])
    else:
        recommended_units = int(weight * profile["units_per_kg"])

    # -----------------------------
    # APPLY CAPS
    # -----------------------------
    warnings = []

    if recommended_units > profile["max_units_per_meal"]:
        warnings.append(
            f"This exceeds your doctor's usual per-meal limit. (> {profile['max_units_per_meal']} units)"
        )
        #recommended_units = profile["max_units_per_meal"]

    if recommended_units > daily_safety_max:
        warnings.append(
            "This exceeds the recommended DAILY (entire day) safety limit."
        )
        #recommended_units = daily_safety_max

    # -----------------------------
    # RESPONSE
    # -----------------------------
    return jsonify({
        "group_type": group_type,
        "classification": classification,
        "meal_fat": meal_fat,
        "recommended_lipase_units": recommended_units,
        "doctor_limit_per_meal": profile["max_units_per_meal"],
        "daily_safety_limit": daily_safety_max,
        "warnings": warnings,
        "note": (
            "This is a supportive estimate based on your doctor's guidance. "
            "If symptoms persist or change, please consult your care team."
        )
    }), 200
