from database.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self):
        self.collection = db["users"]

    # ACCOUNT CREATION
    def create_user(self, data):

        user_doc = {
            "name": data.get("name"),
            "email": data.get("email"),
            "phone": data.get("phone"),
            "password": generate_password_hash(data.get("password")),

            "emergency_contact": data.get("emergency_contact", {
                "name": "",
                "relation": "",
                "phone": ""
            }),
            "onboarding_completed": False,
            
            "reminders": [],

            "created_at": datetime.utcnow()
        }
        return self.collection.insert_one(user_doc)

    # FETCH METHODS
    def get_user_details(self, email):
        return self.collection.find_one({"email": email})

    def get_user_by_id(self, user_id):
        try:
            return self.collection.find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None

    # PASSWORD VERIFICATION
    def verify_password(self, stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    # PROFILE UPDATE (GENERIC)
    def update_user(self, email, data):

        if not email or not data:
             return None

        update_fields = {}

        if "name" in data:
             update_fields["name"] = data["name"]

        if "phone" in data:
         update_fields["phone"] = data["phone"]

        if "password" in data and data["password"]:
         update_fields["password"] = generate_password_hash(data["password"])

        if "emergency_contact" in data:
         update_fields["emergency_contact"] = data["emergency_contact"]

        if "onboarding_completed" in data:
         update_fields["onboarding_completed"] = data["onboarding_completed"]

        if "reminders" in data:
         update_fields["reminders"] = data["reminders"]

        update_fields["updated_at"] = datetime.utcnow()
        
        if "profile_image" in update_fields and not update_fields["profile_image"]:
            update_fields.pop("profile_image")

        return self.collection.update_one(
        {"email": email},
        {"$set": update_fields}
        )
        
        
    # ONBOARDING STATE
    def mark_onboarding_complete(self, user_id=None, email=None):

        if user_id:
            return self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"onboarding_completed": True}}
            )

        if email:
            return self.collection.update_one(
                {"email": email},
                {"$set": {"onboarding_completed": True}}
            )



    #REMINDERS
    def add_reminder(self, email, reminder):
        """
        Existing reminders logic — DO NOT BREAK
        """
        return self.collection.update_one(
            {"email": email},
            {"$push": {"reminders": reminder}}
        )

    def delete_reminder(self, email, reminder):
        """
        Existing reminders logic — DO NOT BREAK
        """
        return self.collection.update_one(
            {"email": email},
            {"$pull": {"reminders": reminder}}
        )
