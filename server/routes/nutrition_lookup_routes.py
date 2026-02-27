# from flask import Blueprint, request, jsonify
# import os
# import requests

# nutrition_lookup_bp = Blueprint("nutrition_lookup", __name__)
# from flask_cors import CORS
# CORS(nutrition_lookup_bp)

# # -----------------------------
# # ENV
# # -----------------------------
# EDAMAM_APP_ID = os.getenv("EDAMAM_NUTRITION_APP_ID")
# EDAMAM_APP_KEY = os.getenv("EDAMAM_NUTRITION_APP_KEY")
# USDA_API_KEY = os.getenv("USDA_API_KEY")

# EDAMAM_URL = "https://api.edamam.com/api/nutrition-details"
# USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

# # -----------------------------
# # USDA SINGLE ITEM LOOKUP
# # -----------------------------
# def usda_lookup_item(text):
#     try:
#         res = requests.get(
#             USDA_SEARCH_URL,
#             params={
#                 "api_key": USDA_API_KEY,
#                 "query": text,
#                 "pageSize": 1
#             },
#             timeout=10
#         )

#         if res.status_code != 200:
#             return None

#         foods = res.json().get("foods", [])
#         if not foods:
#             return None

#         nutrients = foods[0].get("foodNutrients", [])

#         def get(name):
#             for n in nutrients:
#                 if n.get("nutrientName") == name:
#                     return n.get("value", 0)
#             return 0

#         return {
#             "calories": int(get("Energy")),
#             "fat": int(get("Total lipid (fat)")),
#             "protein": int(get("Protein")),
#             "recognized": True
#         }

#     except Exception:
#         return None


# # -----------------------------
# # MAIN ROUTE
# # -----------------------------
# @nutrition_lookup_bp.route("/nutrition/lookup", methods=["POST", "OPTIONS"])
# def analyze_meal():
#     if request.method == "OPTIONS":
#         return jsonify({"status": "ok"}), 200

#     data = request.json or {}
#     items = data.get("items")

#     if not items or not isinstance(items, list):
#         return jsonify({"error": "Meal items list required"}), 400

#     ingredient_lines = [i.get("text") for i in items if i.get("text")]
#     if not ingredient_lines:
#         return jsonify({"error": "No valid food items"}), 400

#     # =====================================================
#     # STEP 1 — EDAMAM (PRIMARY, MEAL-LEVEL)
#     # =====================================================
#     try:
#         edamam_res = requests.post(
#             EDAMAM_URL,
#             params={
#                 "app_id": EDAMAM_APP_ID,
#                 "app_key": EDAMAM_APP_KEY
#             },
#             json={
#                 "title": "Meal Analysis",
#                 "ingr": ingredient_lines
#             },
#             timeout=15
#         )
#     except Exception:
#         edamam_res = None

#     if edamam_res and edamam_res.status_code == 200:
#         result = edamam_res.json()

#         parsed_items = []
#         recognized_count = 0

#         # Per-item parsing
#         for ingr in result.get("ingredients", []):
#             parsed = ingr.get("parsed", [])
#             text = ingr.get("text")

#             if parsed and parsed[0].get("nutrients" ):
#                 n = parsed[0].get("nutrients", {})
#                 parsed_items.append({
#                     "text": text,
#                     "calories": int(n.get("ENERC_KCAL", {}).get("quantity", 0)),
#                     "fat": int(n.get("FAT", {}).get("quantity", 0)),
#                     "protein": int(n.get("PROCNT", {}).get("quantity", 0)),
#                     "recognized": True,
#                     "source": "edamam"
#                 })
#                 recognized_count += 1
#             else:
#                 parsed_items.append({
#                     "text": text,
#                     "calories": 0,
#                     "fat": 0,
#                     "protein": 0,
#                     "recognized": False,
#                     "source": "edamam",
#                     "note": "Not recognized"
#                 })

#         # Totals derived from items (NOT blindly trusting API)
#         total_calories = sum(i["calories"] for i in parsed_items)
#         total_fat = sum(i["fat"] for i in parsed_items)
#         total_protein = sum(i["protein"] for i in parsed_items)

#         status = (
#             "success"
#             if recognized_count == len(ingredient_lines)
#             else "partial"
#         )

#         return jsonify({
#             "status": status,
#             "source": "edamam",
#             "calories": total_calories,
#             "fat": total_fat,
#             "protein": total_protein,
#             "items": parsed_items,
#             "editable": True,
#             "message": (
#                 "Estimated nutrition for this meal."
#                 if status == "success"
#                 else "Some items were not recognized. Please review and edit values."
#             )
#         }), 200

#     # =====================================================
#     # STEP 2 — USDA FALLBACK (ITEM-LEVEL)
#     # =====================================================
#     total_cal = total_fat = total_pro = 0
#     breakdown = []
#     recognized = 0

#     for item in ingredient_lines:
#         usda = usda_lookup_item(item)
#         if usda:
#             total_cal += usda["calories"]
#             total_fat += usda["fat"]
#             total_pro += usda["protein"]
#             recognized += 1
#             breakdown.append({
#                 "text": item,
#                 **usda,
#                 "source": "usda"
#             })
#         else:
#             breakdown.append({
#                 "text": item,
#                 "calories": 0,
#                 "fat": 0,
#                 "protein": 0,
#                 "recognized": False,
#                 "source": "usda",
#                 "note": "Not found"
#             })

#     if recognized > 0:
#         return jsonify({
#             "status": "fallback",
#             "source": "usda",
#             "calories": total_cal,
#             "fat": total_fat,
#             "protein": total_pro,
#             "items": breakdown,
#             "editable": True,
#             "message": (
#                 "Estimated using food database. "
#                 "Some items may need manual correction."
#             )
#         }), 200

#     # =====================================================
#     # STEP 3 — MANUAL ONLY
#     # =====================================================
#     return jsonify({
#         "status": "manual",
#         "source": "none",
#         "items": [
#             {
#                 "text": t,
#                 "calories": 0,
#                 "fat": 0,
#                 "protein": 0,
#                 "recognized": False
#             } for t in ingredient_lines
#         ],
#         "editable": True,
#         "message": (
#             "We could not estimate this meal automatically. "
#             "Please enter nutrition values manually."
#         )
#     }), 200
from flask import Blueprint, request, jsonify
import os
import requests

nutrition_lookup_bp = Blueprint("nutrition_lookup", __name__)
from flask_cors import CORS
CORS(nutrition_lookup_bp)

# -----------------------------
# ENV
# -----------------------------
EDAMAM_APP_ID = os.getenv("EDAMAM_NUTRITION_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_NUTRITION_APP_KEY")
USDA_API_KEY = os.getenv("USDA_API_KEY")

EDAMAM_URL = "https://api.edamam.com/api/nutrition-data"
USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"


# -----------------------------
# USDA SINGLE ITEM LOOKUP
# -----------------------------
def usda_lookup_item(text):
    try:
        res = requests.get(
            USDA_SEARCH_URL,
            params={
                "api_key": USDA_API_KEY,
                "query": text,
                "pageSize": 1
            },
            timeout=10
        )

        if res.status_code != 200:
            return None

        foods = res.json().get("foods", [])
        if not foods:
            return None

        nutrients = foods[0].get("foodNutrients", [])

        def get(name):
            for n in nutrients:
                if n.get("nutrientName") == name:
                    return n.get("value", 0)
            return 0

        calories = get("Energy")
        if not calories:
            for n in nutrients:
                if "energy" in n.get("nutrientName", "").lower():
                    calories = n.get("value", 0)

        return {
            "calories": int(calories or 0),
            "fat": int(get("Total lipid (fat)") or 0),
            "protein": int(get("Protein") or 0),
            "recognized": True
        }

    except Exception:
        return None


# -----------------------------
# MAIN ROUTE
# -----------------------------
@nutrition_lookup_bp.route("/nutrition/lookup", methods=["POST", "OPTIONS"])
def analyze_meal():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    items = data.get("items")

    if not items or not isinstance(items, list):
        return jsonify({"error": "Meal items list required"}), 400

    ingredient_lines = [i.get("text") for i in items if i.get("text")]
    if not ingredient_lines:
        return jsonify({"error": "No valid food items"}), 400

    # =====================================================
    # STEP 1 — EDAMAM (PRIMARY - ITEM LEVEL)
    # =====================================================
    total_calories = 0
    total_fat = 0
    total_protein = 0
    parsed_items = []
    recognized_count = 0

    for item in ingredient_lines:
        try:
            edamam_res = requests.get(
                EDAMAM_URL,
                params={
                    "app_id": EDAMAM_APP_ID,
                    "app_key": EDAMAM_APP_KEY,
                    "ingr": item,
                    "nutrition-type": "logging"
                },
                timeout=10
            )

            # DEBUG (kept as requested)
            print("APP ID:", EDAMAM_APP_ID)
            print("APP KEY:", EDAMAM_APP_KEY)
            print("STATUS:", edamam_res.status_code)
            print("URL:", edamam_res.url)
            print("RESPONSE:", edamam_res.text[:500])

        except Exception:
            edamam_res = None

        if edamam_res and edamam_res.status_code == 200:
            result = edamam_res.json()

            calories = 0
            fat = 0
            protein = 0

            try:
                ingredients = result.get("ingredients", [])

                if ingredients and ingredients[0].get("parsed"):
                    nutrients = ingredients[0]["parsed"][0].get("nutrients", {})

                    calories = int(nutrients.get("ENERC_KCAL", {}).get("quantity", 0))
                    fat = int(nutrients.get("FAT", {}).get("quantity", 0))
                    protein = int(nutrients.get("PROCNT", {}).get("quantity", 0))

            except Exception:
                pass

            if calories > 0:
                recognized_count += 1

            total_calories += calories
            total_fat += fat
            total_protein += protein

            parsed_items.append({
                "text": item,
                "calories": calories,
                "fat": fat,
                "protein": protein,
                "recognized": calories > 0,
                "source": "edamam"
            })
        else:
            parsed_items.append({
                "text": item,
                "calories": 0,
                "fat": 0,
                "protein": 0,
                "recognized": False,
                "source": "edamam",
                "note": "Not recognized"
            })

    if recognized_count > 0:
        status = (
            "success"
            if recognized_count == len(ingredient_lines)
            else "partial"
        )

        return jsonify({
            "status": status,
            "source": "edamam",
            "calories": total_calories,
            "fat": total_fat,
            "protein": total_protein,
            "items": parsed_items,
            "editable": True,
            "message": (
                "Estimated nutrition for this meal."
                if status == "success"
                else "Some items were not recognized. Please review and edit values."
            )
        }), 200

    # =====================================================
    # STEP 2 — USDA FALLBACK
    # =====================================================
    total_cal = total_fat = total_pro = 0
    breakdown = []
    recognized = 0

    for item in ingredient_lines:
        usda = usda_lookup_item(item)
        if usda:
            total_cal += usda["calories"]
            total_fat += usda["fat"]
            total_pro += usda["protein"]
            recognized += 1
            breakdown.append({
                "text": item,
                **usda,
                "source": "usda"
            })
        else:
            breakdown.append({
                "text": item,
                "calories": 0,
                "fat": 0,
                "protein": 0,
                "recognized": False,
                "source": "usda",
                "note": "Not found"
            })

    if recognized > 0:
        return jsonify({
            "status": "fallback",
            "source": "usda",
            "calories": total_cal,
            "fat": total_fat,
            "protein": total_pro,
            "items": breakdown,
            "editable": True,
            "message": (
                "Estimated using food database. "
                "Some items may need manual correction."
            )
        }), 200

    # =====================================================
    # STEP 3 — MANUAL ONLY
    # =====================================================
    return jsonify({
        "status": "manual",
        "source": "none",
        "items": [
            {
                "text": t,
                "calories": 0,
                "fat": 0,
                "protein": 0,
                "recognized": False
            } for t in ingredient_lines
        ],
        "editable": True,
        "message": (
            "We could not estimate this meal automatically. "
            "Please enter nutrition values manually."
        )
    }), 200