from database.db import db
from datetime import datetime

class NutritionProfile:
    def __init__(self):
        self.collection = db["nutrition_profiles"]

    # CREATE / UPDATE (UPSERT)
    def upsert_nutrition_profile(self, email, data):
        nutrition_doc = {
            "email": email,

            # REQUIRED (doctor / dietitian input)
            "daily_calorie_target": int(data.get("daily_calorie_target")),

            # STRUCTURE
            "meals_per_day": int(data.get("meals_per_day", 3)),

            # DIET LOGIC
            # dietary_preferences: ["vegetarian"] / ["keto"] / etc.
            "dietary_preferences": data.get("dietary_preferences", []),


            # ALLERGIES
            "food_allergies": data.get("food_allergies", []),

            # META
            "updated_at": datetime.utcnow()
        }

        return self.collection.update_one(
            {"email": email},
            {"$set": nutrition_doc},
            upsert=True
        )

    # FETCH
    def get_nutrition_profile(self, email):
        doc = self.collection.find_one({"email": email}, {"_id": 0})

        if not doc:
            return None

        # Backward compatibility: clean up legacy fields if present
        doc.pop("cuisine_preferences", None)
        doc.pop("snacks_per_day", None)

        # Ensure defaults
        doc.setdefault("dietary_preferences", [])
        doc.setdefault("food_allergies", [])
        doc.setdefault("meals_per_day", 3)

        return doc

    # PARTIAL UPDATE (weekly edits)
    def update_nutrition_profile(self, email, data):
        if not email or not data:
            return None

        update_fields = {}

        if "daily_calorie_target" in data:
            update_fields["daily_calorie_target"] = int(data["daily_calorie_target"])

        if "meals_per_day" in data:
            update_fields["meals_per_day"] = int(data["meals_per_day"])

        if "dietary_preferences" in data:
            update_fields["dietary_preferences"] = data["dietary_preferences"]

        if "food_allergies" in data:
            update_fields["food_allergies"] = data["food_allergies"]

        update_fields["updated_at"] = datetime.utcnow()

        return self.collection.update_one(
            {"email": email},
            {"$set": update_fields}
        )
