from database.db import db
from datetime import date, datetime
from zoneinfo import ZoneInfo

class DailyMealPlan:

    # def get_today_plan(self, email):
    #     today = date.today().isoformat()
    #     return db.daily_meal_plans.find_one(
    #         {"email": email, "date": today},
    #         {"_id": 0}
    #     )

    # def create_plan(self, email, plan_data):
    #     today = date.today().isoformat()

    #     doc = {
    #         "email": email,
    #         "date": today,
    #         "calorie_target": plan_data.get("calorie_target"),
    #         "meals": plan_data.get("meals", {}),
    #         "created_at": datetime.utcnow()
    #     }

    #     # Replace existing plan for today if it exists (safety)
    #     db.daily_meal_plans.update_one(
    #         {"email": email, "date": today},
    #         {"$set": doc},
    #         upsert=True
    #     )

    #     return doc

    # def delete_today_plan(self, email):
    #     today = date.today().isoformat()
    #     db.daily_meal_plans.delete_one({
    #         "email": email,
    #         "date": today
    #     })
    
    def _today(self):
        return datetime.now(
            ZoneInfo("Asia/Kolkata")
        ).date().isoformat()

    def get_today_plan(self, email, date_str=None):
        today = date_str or self._today()

        return db.daily_meal_plans.find_one(
            {"email": email, "date": today},
            {"_id": 0}
        )

    def create_plan(self, email, plan_data):
        today = self._today()

        doc = {
            "email": email,
            "date": today,
            "calorie_target": plan_data.get("calorie_target"),
            "meals": plan_data.get("meals", {}),
            "created_at": datetime.utcnow()
        }

        db.daily_meal_plans.update_one(
            {"email": email, "date": today},
            {"$set": doc},
            upsert=True
        )

        return doc

    def delete_today_plan(self, email):
        today = self._today()

        db.daily_meal_plans.delete_one({
            "email": email,
            "date": today
        })
