from database.db import db
from datetime import datetime, date, time

class HealthProfile:

    def __init__(self):
        self.collection = db["health_profiles"]

    # CREATE / UPDATE (UPSERT)
    def upsert_health_profile(self, email, data):

        dob = data.get("dob")

        if isinstance(dob, str):
            try:
                dob = datetime.strptime(dob, "%Y-%m-%d").date()
            except ValueError:
                dob = None
        elif isinstance(dob, date) and not isinstance(dob, datetime):
             dob = datetime.combine(dob, datetime.min.time())
        elif isinstance(dob, datetime):
            pass
        else:
             dob = None

        health_doc = {

            # Core health fields
            "dob": dob,
            "sex": data.get("sex"),
            "height": data.get("height"),
            "weight": data.get("weight"),

            # Dietary
            "allergies": data.get("allergies", []),

            # Meta
            "updated_at": datetime.utcnow()
        }

        return self.collection.update_one(
            {"email":email},   # ✅ user_id ONLY here
            {"$set": health_doc},
            upsert=True
        )

    #UPDATE
    def update_health_profile(self, email, data):

        if not email or not data:
            return None

        update_fields = {}

        if "dob" in data:
            dob = data.get("dob")
            if isinstance(dob, str):
                try:
                    dob = datetime.strptime(dob, "%Y-%m-%d")
                except ValueError:
                    raise ValueError("DOB must be in yyyy-MM-dd format")
            elif isinstance(dob, date):
                dob = datetime.strptime(dob, "%Y-%m-%d")
            elif isinstance(dob, datetime):
                pass  # already date
            else:
                dob = None
            update_fields["dob"] = dob

        if "sex" in data:
            update_fields["sex"] = data["sex"]          
        if "height" in data:
            update_fields["height"] = data["height"]
        if "weight" in data:
            update_fields["weight"] = data["weight"]
        if "allergies" in data:
            update_fields["allergies"] = data["allergies"]
        update_fields["updated_at"] = datetime.utcnow()
        return self.collection.update_one(
            {"email": email},
            {"$set": update_fields}
        )
        
    # FETCH
    def get_health_profile(self, email):
        return self.collection.find_one(
            {"email":email},
            {"_id": 0}
        )

    # DELETE (OPTIONAL / FUTURE)
    def delete_health_profile(self, email):
        return self.collection.delete_one(
            {"email": email}
        )
