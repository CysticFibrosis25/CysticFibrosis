from flask import Blueprint, request, jsonify
from datetime import datetime
import requests
import os
import random
import google.generativeai as genai

from models.nutrition_profile import NutritionProfile
from models.daily_meal_plan import DailyMealPlan

# -------------------------
# Broad keyword pools (Edamam-friendly)
# -------------------------

BREAKFAST_KEYWORDS = [
  "eggs", "toast", "oats", "porridge", "pancakes", "waffles",
  "smoothie bowl", "yogurt bowl", "granola", "fruit bowl", "avocado toast",
  "omelette", "scrambled eggs", "banana oats", "peanut butter toast"
]

MAIN_MEAL_KEYWORDS = [
  "chicken", "rice", "pasta", "noodles", "burger", "wrap", "sandwich", "bowl",
  "salad", "stir fry", "curry", "grilled chicken", "fish", "salmon", "tuna",
  "beef", "mutton", "lamb", "lentils", "beans", "tofu", "paneer", "vegetables",
  "soup", "quinoa", "noodle bowl", "rice bowl", "protein bowl", "chickpea curry",
  "black beans", "mixed vegetables", "chicken breast", "grilled fish"
]

SIDE_KEYWORDS = [
  "salad", "vegetables", "steamed vegetables", "roasted vegetables", "potatoes",
  "sweet potato", "mashed potatoes", "bread", "garlic bread", "yogurt",
  "hummus", "soup", "corn", "beans", "lentil salad", "chickpea salad",
  "avocado salad", "fruit salad", "coleslaw"
]

SMOOTHIE_KEYWORDS = [
  "smoothie", "fruit smoothie", "banana smoothie", "berry smoothie",
  "mango smoothie", "protein shake", "milkshake", "yogurt smoothie",
  "peanut butter smoothie", "oats smoothie", "chocolate milkshake",
  "vanilla milkshake", "date smoothie"
]

SNACK_KEYWORDS = [
  "snack", "nuts", "trail mix", "granola bar", "protein bar", "sandwich",
  "toast", "fruit", "apple", "banana", "yogurt", "cheese", "boiled eggs",
  "energy balls", "peanut butter toast", "crackers", "hummus snack",
  "milk", "chocolate milk", "smoothie small"
]

# Diet-specific main meal pools (still broad)
KETO_KEYWORDS = ["grilled chicken", "salmon", "eggs", "omelette", "avocado", "steak", "low carb bowl"]
PALEO_KEYWORDS = ["grilled chicken", "fish", "beef", "vegetables", "sweet potato", "salad"]
VEG_KEYWORDS = ["paneer", "tofu", "lentils", "beans", "vegetable curry", "veg bowl"]
VEGAN_KEYWORDS = ["tofu", "lentils", "beans", "chickpeas", "vegetable bowl", "vegan curry"]
GF_KEYWORDS = ["rice bowl", "grilled chicken", "fish", "vegetables", "potatoes"]

EDAMAM_DIET_MAP = {
    "keto": "keto-friendly",
    "paleo": "paleo",
    "vegetarian": "vegetarian",
    "vegan": "vegan",
    "gluten_free": "gluten-free"
}

EDAMAM_ALLERGY_MAP = {
    "peanuts": "peanut-free",
    "shellfish": "shellfish-free",
    "dairy": "dairy-free",
    "eggs": "egg-free",
    "soy": "soy-free",
    "gluten": "gluten-free"
}

recipe_bp = Blueprint("recipes", __name__)

nutrition_model = NutritionProfile()
daily_plan_model = DailyMealPlan()

EDAMAM_APP_ID = os.getenv("EDAMAM_RECIPE_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_RECIPE_APP_KEY")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# -------------------------
# Helpers
# -------------------------

from zoneinfo import ZoneInfo
from datetime import datetime

def today_str():
    tz = ZoneInfo("Asia/Kolkata")
    return datetime.now(tz).date().isoformat()


def calorie_range(target):
    low = int(target * 0.8)   # ±20% tolerance
    high = int(target * 1.2)
    return f"{low}-{high}"

def local_fallback_item(calories, title_hint):
    return {
        "title": f"{title_hint.capitalize()} (simple homemade option)",
        "image": None,
        "calories": calories,
        "fat": int(calories * 0.03),
        "protein": int(calories * 0.04),
        "readyInMinutes": 15,
        "url": None,
        "source": "local",
        "note": "Simple homemade suggestion. You can choose any similar dish."
    }

def fetch_edamam_recipe(query, calories, diet=None, allergies=None):
    if not EDAMAM_APP_ID or not EDAMAM_APP_KEY:
        print("EDAMAM KEYS MISSING")
        return None

    params = {
        "type": "public",
        "q": query,
        "app_id": EDAMAM_APP_ID,
        "app_key": EDAMAM_APP_KEY,
        "calories": calorie_range(calories)
    }

    health_params = []
    if diet:
        health_params.append(diet)

    if allergies:
        for a in allergies:
            if a and a != "none" and a in EDAMAM_ALLERGY_MAP:
                health_params.append(EDAMAM_ALLERGY_MAP[a])

    if health_params:
        params["health"] = health_params

    headers = {
        "Edamam-Account-User": "cf_app_user"
    }

    res = requests.get(
        "https://api.edamam.com/api/recipes/v2",
        params=params,
        headers=headers,
        timeout=10
    )

    print("EDAMAM URL:", res.url)
    print("EDAMAM STATUS:", res.status_code)

    if res.status_code != 200:
        print("EDAMAM ERROR:", res.text[:300])
        return None

    data = res.json()
    hits = data.get("hits", [])

    if not hits:
        print("EDAMAM 0 HITS for:", query, "cal:", calories)
        return None

    r = hits[0]["recipe"]
    total_cal = r.get("calories", 0)
    servings = r.get("yield") or 1

    per_cal = total_cal / servings

    total_fat = r.get("totalNutrients", {}).get("FAT", {}).get("quantity", 0)
    per_fat = total_fat / servings

    total_protein = r.get("totalNutrients", {}).get("PROCNT", {}).get("quantity", 0)
    per_protein = total_protein / servings

    return {
        "title": r["label"],
        image_url = r.get("image")
        if image_url and image_url.startswith("http://"):
          image_url = image_url.replace("http://", "https://")
        "image": image_url,
        "calories": int(per_cal),
        "fat": int(per_fat),
        "protein": int(per_protein),
        "readyInMinutes": r.get("totalTime"),
        "url": r.get("url"),
        "servings": int(servings),
        "source": "edamam"
    }



def gemini_recipe_fallback(calories, meal_name):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        model.generate_content("ping")
        return {
            "title": f"{meal_name.capitalize()} suggestion",
            "calories": calories,
            "fat": 0,
            "protein": 0,
            "readyInMinutes": None,
            "image": None,
            "url": None,
            "source": "gemini",
            "note": "AI-generated fallback."
        }
    except Exception:
        return None

# -------------------------
# CALORIE DISTRIBUTION
# -------------------------

def build_meal_targets(total_calories, meals_per_day):
    targets = {
        "breakfast": int(total_calories * 0.25),
        "lunch": int(total_calories * 0.25),
        "dinner": int(total_calories * 0.25),
    }

    remaining = total_calories - sum(targets.values())
    if meals_per_day > 3:
        snack_count = meals_per_day - 3
        per_snack = int(remaining / snack_count)
        for i in range(1, snack_count + 1):
            targets[f"snack_{i}"] = per_snack

    return targets

# -------------------------
# MAIN ROUTE
# -------------------------

@recipe_bp.route("/recipes/day-plan", methods=["GET"])
def get_daily_meal_plan():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400

    existing = daily_plan_model.get_today_plan(email, today_str())
    if existing:
        return jsonify(existing), 200
    
    return jsonify({"message": "No plan generated today"}), 404

@recipe_bp.route("/recipes/day-plan", methods=["POST"])
def generate_daily_meal_plan():
    data = request.json or {}
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    # Prevent duplicate same-day generation
    existing = daily_plan_model.get_today_plan(email, today_str())
    if existing:
        return jsonify(existing), 200

    nutrition = nutrition_model.get_nutrition_profile(email)
    if not nutrition:
        return jsonify({"error": "Nutrition profile not found"}), 404

    total_calories = nutrition["daily_calorie_target"]
    meals_per_day = nutrition.get("meals_per_day", 3)

    diet_key = (nutrition.get("dietary_preferences") or [None])[0]
    diet = EDAMAM_DIET_MAP.get(diet_key)
    allergies = nutrition.get("food_allergies", [])

    meal_targets = build_meal_targets(total_calories, meals_per_day)
    meals = {}

    for meal_name, calories in meal_targets.items():
        if meal_name in ["breakfast", "lunch", "dinner"]:
            main_target = int(calories * 0.6)
            side_target = int(calories * 0.2)
            smoothie_target = int(calories * 0.2)

            if meal_name == "breakfast":
                main_kw = random.choice(BREAKFAST_KEYWORDS)
            else:
                if diet_key == "keto":
                    main_kw = random.choice(KETO_KEYWORDS)
                elif diet_key == "paleo":
                    main_kw = random.choice(PALEO_KEYWORDS)
                elif diet_key == "vegetarian":
                    main_kw = random.choice(VEG_KEYWORDS)
                elif diet_key == "vegan":
                    main_kw = random.choice(VEGAN_KEYWORDS)
                elif diet_key == "gluten_free":
                    main_kw = random.choice(GF_KEYWORDS)
                else:
                    main_kw = random.choice(MAIN_MEAL_KEYWORDS)

            main_item = (
                fetch_edamam_recipe(main_kw, main_target, diet, allergies)
                or gemini_recipe_fallback(main_target, f"{meal_name} main")
                or local_fallback_item(main_target, f"{meal_name} main")
            )

            side_item = (
                fetch_edamam_recipe(random.choice(SIDE_KEYWORDS), side_target, None if diet_key in ["keto", "paleo"] else diet, allergies)
                or gemini_recipe_fallback(side_target, f"{meal_name} side")
                or local_fallback_item(side_target, f"{meal_name} side")
            )

            smoothie_item = (
                fetch_edamam_recipe(random.choice(SMOOTHIE_KEYWORDS), smoothie_target, None if diet_key in ["keto", "paleo"] else diet, allergies)
                or gemini_recipe_fallback(smoothie_target, f"{meal_name} smoothie")
                or local_fallback_item(smoothie_target, f"{meal_name} smoothie")
            )

            meals[meal_name] = {"items": [main_item, side_item, smoothie_item]}
        else:
            snack_item = (
                fetch_edamam_recipe(random.choice(SNACK_KEYWORDS), calories, None if diet_key in ["keto", "paleo"] else diet, allergies)
                or gemini_recipe_fallback(calories, meal_name)
                or local_fallback_item(calories, meal_name)
            )
            meals[meal_name] = {"items": [snack_item]}

    plan = daily_plan_model.create_plan(email, {
        "calorie_target": total_calories,
        "meals": meals
    })

    return jsonify(plan), 200

# from flask import Blueprint, request, jsonify
# from datetime import datetime
# import requests
# import os
# import random
# import google.generativeai as genai
# import pytz

# from models.nutrition_profile import NutritionProfile
# from models.daily_meal_plan import DailyMealPlan

# # -------------------------
# # Broad keyword pools (Edamam-friendly)
# # -------------------------

# BREAKFAST_KEYWORDS = [
#   "eggs", "toast", "oats", "porridge", "pancakes", "waffles",
#   "smoothie bowl", "yogurt bowl", "granola", "fruit bowl", "avocado toast",
#   "omelette", "scrambled eggs", "banana oats", "peanut butter toast"
# ]

# MAIN_MEAL_KEYWORDS = [
#   "chicken", "rice", "pasta", "noodles", "burger", "wrap", "sandwich", "bowl",
#   "salad", "stir fry", "curry", "grilled chicken", "fish", "salmon", "tuna",
#   "beef", "mutton", "lamb", "lentils", "beans", "tofu", "paneer", "vegetables",
#   "soup", "quinoa", "noodle bowl", "rice bowl", "protein bowl", "chickpea curry",
#   "black beans", "mixed vegetables", "chicken breast", "grilled fish"
# ]

# SIDE_KEYWORDS = [
#   "salad", "vegetables", "steamed vegetables", "roasted vegetables", "potatoes",
#   "sweet potato", "mashed potatoes", "bread", "garlic bread", "yogurt",
#   "hummus", "soup", "corn", "beans", "lentil salad", "chickpea salad",
#   "avocado salad", "fruit salad", "coleslaw"
# ]

# SMOOTHIE_KEYWORDS = [
#   "smoothie", "fruit smoothie", "banana smoothie", "berry smoothie",
#   "mango smoothie", "protein shake", "milkshake", "yogurt smoothie",
#   "peanut butter smoothie", "oats smoothie", "chocolate milkshake",
#   "vanilla milkshake", "date smoothie"
# ]

# SNACK_KEYWORDS = [
#   "snack", "nuts", "trail mix", "granola bar", "protein bar", "sandwich",
#   "toast", "fruit", "apple", "banana", "yogurt", "cheese", "boiled eggs",
#   "energy balls", "peanut butter toast", "crackers", "hummus snack",
#   "milk", "chocolate milk", "smoothie small"
# ]

# KETO_KEYWORDS = ["grilled chicken", "salmon", "eggs", "omelette", "avocado", "steak", "low carb bowl"]
# PALEO_KEYWORDS = ["grilled chicken", "fish", "beef", "vegetables", "sweet potato", "salad"]
# VEG_KEYWORDS = ["paneer", "tofu", "lentils", "beans", "vegetable curry", "veg bowl"]
# VEGAN_KEYWORDS = ["tofu", "lentils", "beans", "chickpeas", "vegetable bowl", "vegan curry"]
# GF_KEYWORDS = ["rice bowl", "grilled chicken", "fish", "vegetables", "potatoes"]

# EDAMAM_DIET_MAP = {
#     "keto": "keto-friendly",
#     "paleo": "paleo",
#     "vegetarian": "vegetarian",
#     "vegan": "vegan",
#     "gluten_free": "gluten-free"
# }

# EDAMAM_ALLERGY_MAP = {
#     "peanuts": "peanut-free",
#     "shellfish": "shellfish-free",
#     "dairy": "dairy-free",
#     "eggs": "egg-free",
#     "soy": "soy-free",
#     "gluten": "gluten-free"
# }

# recipe_bp = Blueprint("recipes", __name__)

# nutrition_model = NutritionProfile()
# daily_plan_model = DailyMealPlan()

# EDAMAM_APP_ID = os.getenv("EDAMAM_RECIPE_APP_ID")
# EDAMAM_APP_KEY = os.getenv("EDAMAM_RECIPE_APP_KEY")

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# # -------------------------
# # Helpers
# # -------------------------

# def today_str():
#     tz = pytz.timezone("Asia/Kolkata")
#     return datetime.now(tz).date().isoformat()

# def calorie_range(target):
#     low = int(target * 0.8)
#     high = int(target * 1.2)
#     return f"{low}-{high}"

# def local_fallback_item(calories, title_hint):
#     return {
#         "title": f"{title_hint.capitalize()} (simple homemade option)",
#         "image": None,
#         "calories": calories,
#         "fat": int(calories * 0.03),
#         "protein": int(calories * 0.04),
#         "readyInMinutes": 15,
#         "url": None,
#         "source": "local",
#         "note": "Simple homemade suggestion. You can choose any similar dish."
#     }

# # (FETCH EDAMAM FUNCTION REMAINS EXACTLY SAME — NOT CHANGED)

# # -------------------------
# # GET → Only Fetch Existing
# # -------------------------

# @recipe_bp.route("/recipes/day-plan", methods=["GET"])
# def get_daily_meal_plan():
#     email = request.args.get("email")
#     if not email:
#         return jsonify({"error": "Email required"}), 400

#     existing = daily_plan_model.get_today_plan(email, today_str())

#     if not existing:
#         return jsonify({"message": "No plan generated today"}), 404

#     return jsonify(existing), 200

# # -------------------------
# # POST → Generate Only When Clicked
# # -------------------------

# @recipe_bp.route("/recipes/day-plan", methods=["POST"])
# def generate_daily_meal_plan():
#     data = request.json or {}
#     email = data.get("email")

#     if not email:
#         return jsonify({"error": "Email required"}), 400

#     # Prevent duplicate generation same day
#     existing = daily_plan_model.get_today_plan(email, today_str())
#     if existing:
#         return jsonify(existing), 200

#     nutrition = nutrition_model.get_nutrition_profile(email)
#     if not nutrition:
#         return jsonify({"error": "Nutrition profile not found"}), 404

#     total_calories = nutrition["daily_calorie_target"]
#     meals_per_day = nutrition.get("meals_per_day", 3)

#     diet_key = (nutrition.get("dietary_preferences") or [None])[0]
#     diet = EDAMAM_DIET_MAP.get(diet_key)
#     allergies = nutrition.get("food_allergies", [])

#     meal_targets = build_meal_targets(total_calories, meals_per_day)
#     meals = {}

#     for meal_name, calories in meal_targets.items():
#         if meal_name in ["breakfast", "lunch", "dinner"]:
#             main_target = int(calories * 0.6)
#             side_target = int(calories * 0.2)
#             smoothie_target = int(calories * 0.2)

#             if meal_name == "breakfast":
#                 main_kw = random.choice(BREAKFAST_KEYWORDS)
#             else:
#                 if diet_key == "keto":
#                     main_kw = random.choice(KETO_KEYWORDS)
#                 elif diet_key == "paleo":
#                     main_kw = random.choice(PALEO_KEYWORDS)
#                 elif diet_key == "vegetarian":
#                     main_kw = random.choice(VEG_KEYWORDS)
#                 elif diet_key == "vegan":
#                     main_kw = random.choice(VEGAN_KEYWORDS)
#                 elif diet_key == "gluten_free":
#                     main_kw = random.choice(GF_KEYWORDS)
#                 else:
#                     main_kw = random.choice(MAIN_MEAL_KEYWORDS)

#             main_item = (
#                 fetch_edamam_recipe(main_kw, main_target, diet, allergies)
#                 or gemini_recipe_fallback(main_target, f"{meal_name} main")
#                 or local_fallback_item(main_target, f"{meal_name} main")
#             )

#             side_item = (
#                 fetch_edamam_recipe(random.choice(SIDE_KEYWORDS), side_target, diet, allergies)
#                 or gemini_recipe_fallback(side_target, f"{meal_name} side")
#                 or local_fallback_item(side_target, f"{meal_name} side")
#             )

#             smoothie_item = (
#                 fetch_edamam_recipe(random.choice(SMOOTHIE_KEYWORDS), smoothie_target, diet, allergies)
#                 or gemini_recipe_fallback(smoothie_target, f"{meal_name} smoothie")
#                 or local_fallback_item(smoothie_target, f"{meal_name} smoothie")
#             )

#             meals[meal_name] = {"items": [main_item, side_item, smoothie_item]}
#         else:
#             snack_item = (
#                 fetch_edamam_recipe(random.choice(SNACK_KEYWORDS), calories, diet, allergies)
#                 or gemini_recipe_fallback(calories, meal_name)
#                 or local_fallback_item(calories, meal_name)
#             )
#             meals[meal_name] = {"items": [snack_item]}

#     plan = daily_plan_model.create_plan(email, {
#         "date": today_str(),
#         "calorie_target": total_calories,
#         "meals": meals
#     })

#     return jsonify(plan), 200
