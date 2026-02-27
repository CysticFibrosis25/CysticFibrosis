from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from database.db import db
import os

food_bp = Blueprint("food", __name__)
from flask_cors import CORS
CORS(food_bp)

# -----------------------------
# Helpers
# ----------------------------

def today_str():
    return date.today().isoformat()

def is_today(day_str):
    return day_str == today_str()

def empty_meal():
    return {
        "items": [],
        "total_calories": 0,
        "total_fat": 0,
        "total_protein": 0
    }

def new_day_document(email, day_str):
    return {
        "email": email,
        "date": day_str,
        "locked": not is_today(day_str),
        "meals": {
            "breakfast": empty_meal(),
            "lunch": empty_meal(),
            "dinner": empty_meal(),
            "snacks": []
        },
        "daily_totals": {
            "calories": 0,
            "fat": 0,
            "protein": 0
            
        },
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

def recalc_day_totals(day_doc):
    calories = 0
    fat = 0
    protein = 0

    for key in ["breakfast", "lunch", "dinner"]:
        calories += day_doc["meals"][key]["total_calories"]
        fat += day_doc["meals"][key]["total_fat"]
        protein += day_doc["meals"][key]["total_protein"]

    for snack in day_doc["meals"]["snacks"]:
        calories += snack["total_calories"]
        fat += snack["total_fat"]
        protein += snack["total_protein"]

    day_doc["daily_totals"]["calories"] = calories
    day_doc["daily_totals"]["fat"] = fat
    day_doc["daily_totals"]["protein"] = protein


# -----------------------------
# GET OR INIT DAY (internal)
# -----------------------------

def get_or_create_day(email, day_str):
    doc = db.food_logs.find_one({"email": email, "date": day_str})
    if doc:
        return doc

    new_doc = new_day_document(email, day_str)
    db.food_logs.insert_one(new_doc)
    return new_doc


# -----------------------------
# FETCH DAY DATA
# -----------------------------

@food_bp.route("/food/day", methods=["GET"])
def get_day():
    email = request.args.get("email", "").strip()
    day_str = request.args.get("date", today_str())

    if not email:
        return jsonify({"error": "Email required"}), 400

    doc = db.food_logs.find_one(
        {"email": email, "date": day_str},
        {"_id": 0}
    )

    if not doc:
        if is_today(day_str):
            doc = get_or_create_day(email, day_str)
        else:
            return jsonify({
                "date": day_str,
                "daily_totals": {"calories": 0, "fat": 0, "protein": 0},
                "meals": None
            }), 200

    return jsonify(doc), 200


# -----------------------------
# ADD FOOD ITEM (TODAY ONLY)
# -----------------------------

@food_bp.route("/food/add-item", methods=["POST", "OPTIONS"])
def add_food_item():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json or {}

    email = data.get("email", "").strip()
    day_str = data.get("date", today_str())
    meal_type = data.get("meal_type")
    text = data.get("text")
    calories = int(data.get("calories", 0))
    fat = int(data.get("fat", 0))
    protein = int(data.get("protein", 0))
    snack_id = data.get("snack_id")

    if not email or not text or not meal_type:
        return jsonify({"error": "Missing required fields"}), 400

    if not is_today(day_str):
        return jsonify({"error": "Past days are locked"}), 403

    day_doc = get_or_create_day(email, day_str)

    item = {
        "text": text,
        "calories": calories,
        "fat": fat,
        "protein": protein,
        "timestamp": datetime.utcnow()
    }

    if meal_type in ["breakfast", "lunch", "dinner"]:
        meal = day_doc["meals"][meal_type]
        meal["items"].append(item)
        meal["total_calories"] += calories
        meal["total_fat"] += fat
        meal["total_protein"] += protein

    elif meal_type == "snack":
    # Ensure snack_id exists
     if snack_id is None:
        snack_id = len(day_doc["meals"]["snacks"]) + 1

    # Find or create snack
     snack = next(
        (s for s in day_doc["meals"]["snacks"] if s["snack_id"] == snack_id),
        None
     )

     if not snack:
        snack = {
            "snack_id": snack_id,
            "items": [],
            "total_calories": 0,
            "total_fat": 0,
            "total_protein": 0
        }
        day_doc["meals"]["snacks"].append(snack)

     snack["items"].append(item)
     snack["total_calories"] += calories
     snack["total_fat"] += fat
     snack["total_protein"] += protein

    else:
        return jsonify({"error": "Invalid meal_type"}), 400

    recalc_day_totals(day_doc)
    day_doc["updated_at"] = datetime.utcnow()

    db.food_logs.update_one(
        {"email": email, "date": day_str},
        {"$set": day_doc}
    )

    return jsonify({
        "message": "Food item added successfully",
        "daily_totals": day_doc["daily_totals"]
    }), 200


# -----------------------------
# DELETE FOOD ITEM (TODAY ONLY)
# -----------------------------

@food_bp.route("/food/delete-item", methods=["DELETE"])
def delete_food_item():
    data = request.json or {}

    email = data.get("email", "").strip()
    day_str = data.get("date", today_str())
    meal_type = data.get("meal_type")
    index = data.get("index")
    snack_id = data.get("snack_id")

    if not email or index is None or not meal_type:
        return jsonify({"error": "Missing required fields"}), 400

    if not is_today(day_str):
        return jsonify({"error": "Past days are locked"}), 403

    day_doc = get_or_create_day(email, day_str)

    try:
        if meal_type in ["breakfast", "lunch", "dinner"]:
            item = day_doc["meals"][meal_type]["items"].pop(index)
            day_doc["meals"][meal_type]["total_calories"] -= item["calories"]
            day_doc["meals"][meal_type]["total_fat"] -= item["fat"]
            day_doc["meals"][meal_type]["total_protein"] -= item["protein"]

        elif meal_type == "snack":
            snack = next(
                s for s in day_doc["meals"]["snacks"] if s["snack_id"] == snack_id
            )
            item = snack["items"].pop(index)
            snack["total_calories"] -= item["calories"]
            snack["total_fat"] -= item["fat"]
            snack["total_protein"] -= item["protein"]

        else:
            return jsonify({"error": "Invalid meal_type"}), 400

    except Exception:
        return jsonify({"error": "Invalid item index"}), 400

    recalc_day_totals(day_doc)
    day_doc["updated_at"] = datetime.utcnow()

    db.food_logs.update_one(
        {"email": email, "date": day_str},
        {"$set": day_doc}
    )

    return jsonify({
        "message": "Food item deleted",
        "daily_totals": day_doc["daily_totals"]
    }), 200


# -----------------------------
# WEEKLY SUMMARY (BARS)
# -----------------------------

@food_bp.route("/food/weekly", methods=["GET"])
def get_weekly_summary():
    email = request.args.get("email", "").strip()
    if not email:
        return jsonify({"error": "Email required"}), 400

    today = date.today()
    result = []

    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        d_str = d.isoformat()

        log = db.food_logs.find_one(
            {"email": email, "date": d_str},
            {"daily_totals": 1, "_id": 0}
        )

        calories = log["daily_totals"]["calories"] if log else 0

        result.append({
            "date": d_str,
            "calories": calories
        })

    return jsonify(result), 200


