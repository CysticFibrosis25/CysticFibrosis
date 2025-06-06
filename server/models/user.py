from database.db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self):
        self.collection = db["users"]  

    def create_user(self, data):
        data["password"] = generate_password_hash(data["password"])
        return self.collection.insert_one(data)

    def get_user_details(self, email):
        return self.collection.find_one({"email": email})

    def verify_password(self, stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    def update_user(self, email, updated_data):
        return self.collection.update_one(
            {"email": email},
            {"$set": updated_data}
        )
        
    def add_reminder(self, email, reminder):
        return self.collection.update_one(
            {"email": email},
            {"$push": {"reminders": reminder}}
        )
    def delete_reminder(self, email, reminder):
        return self.collection.update_one(
            {"email": email},
            {"$pull": {"reminders": reminder}}
        )