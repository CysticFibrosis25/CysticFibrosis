from database.db import db
from datetime import datetime

class EnzymeProfile:
    def __init__(self):
        self.collection = db["enzyme_profiles"]

    def upsert_profile(self, email, data):
        doc = {
            "email": email,
            "mode": data.get("mode"),  # "fat" or "weight"
            "units_per_gram": data.get("units_per_gram"),
            "units_per_kg": data.get("units_per_kg"),
            "max_units_per_meal": data.get("max_units_per_meal"),
            "updated_at": datetime.utcnow()
        }

        return self.collection.update_one(
            {"email": email},
            {"$set": doc},
            upsert=True
        )

    def get_profile(self, email):
        return self.collection.find_one(
            {"email": email},
            {"_id": 0}
        )
