from database.db import db
from datetime import datetime

class CFProfile:
    def __init__(self):
        self.collection = db["cf_profiles"]

    # CREATE / UPDATE (UPSERT)
    def upsert_cf_profile(self, email, data):

        cf_doc = {
            "email": email,

            # CF core info
            "cf_type": data.get("cf_type"),
            "lung_transplant": data.get("lung_transplant"),

            # Clinical details
            "symptoms": data.get("symptoms", []),
            "other_conditions": data.get("other_conditions"),
            "medications": data.get("medications"),

            # Meta
            "updated_at": datetime.utcnow()
        }

        return self.collection.update_one(
            {"email": email},
            {"$set": cf_doc},
            upsert=True
        )
        
    def update_cf_profile(self, email, data):

        if not email or not data:
            return None

        update_fields = {}

        if "cf_type" in data:
            update_fields["cf_type"] = data["cf_type"]

        if "lung_transplant" in data:
            update_fields["lung_transplant"] = data["lung_transplant"]

        if "symptoms" in data:
            update_fields["symptoms"] = data["symptoms"]

        if "other_conditions" in data:
            update_fields["other_conditions"] = data["other_conditions"]

        if "medications" in data:
            update_fields["medications"] = data["medications"]

        update_fields["updated_at"] = datetime.utcnow()

        return self.collection.update_one(
            {"email": email},
            {"$set": update_fields}
        )
    

    # FETCH
    def get_cf_profile(self, email):
        return self.collection.find_one(
            {"email": email},
            {"_id": 0}
        )

    # DELETE (OPTIONAL / FUTURE)
    def delete_cf_profile(self, email):
        return self.collection.delete_one(
            {"email": email}
        )
