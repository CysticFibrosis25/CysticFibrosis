import os
import tempfile
import zipfile
from flask import request
from flask import jsonify
from datetime import datetime, date
from ml.predict import predict
from database.db import db  
class PredictionService:
    @staticmethod
    def _calculate_age_from_dob(dob):
        today = date.today()
        return today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )
        
    @staticmethod
    def process_prediction(ct_zip_file, email): 
        # 1. Get user from MongoDB
        user = db.users.find_one({"email": email}) 
        if not user:
            raise ValueError("User not found")

        # 2. Validate required fields
        health_profile = db.health_profiles.find_one({"email": user["email"]})
        if not health_profile:
            raise ValueError("Health profile not found")

        dob_raw = health_profile.get("dob")
        if not dob_raw:
            raise ValueError("Date of birth missing in health profile")

# ---- FIX: Convert DOB safely ----
        if isinstance(dob_raw, str):
            try:
            # handles: "2005-05-05" or "Thu, 05 May 2005 00:00:00 GMT"
                dob = datetime.strptime(dob_raw[:10], "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("DOB format invalid, expected yyyy-mm-dd")
        elif isinstance(dob_raw, datetime):
            dob = dob_raw.date()
        elif isinstance(dob_raw, date):
            dob = dob_raw
        else:
            raise ValueError("DOB type invalid in health profile")

        theage = PredictionService._calculate_age_from_dob(dob)



        sex = health_profile.get("sex")
        if not sex:
            raise ValueError("Sex missing in health profile")

        # 3. Process CT scan
        with tempfile.TemporaryDirectory() as temp_dir:
            zip_path = os.path.join(temp_dir, 'upload.zip')
            ct_zip_file.save(zip_path)
            
            with zipfile.ZipFile(zip_path, 'r') as z:
                z.extractall(temp_dir)
            
            # 4. Run prediction (using your existing predict function)
            slope, message = predict(
                patient_folder=temp_dir,
                age=theage,
                sex=sex,
                fvc=float(request.form.get('fvc', 0))  # Optional FVC from form
            )
            
            # 5. Save to predictions collection
            prediction_record = {
                'user_email': email,
                "user_id": user["_id"],#user_data['email']
                'timestamp': datetime.utcnow(),
                'slope': slope,
                'message': message,
                'fvc': float(request.form.get('fvc', 0)) if request.form.get('fvc') else None
            }
            db.predictions.insert_one(prediction_record)
            
            return {
                'slope': slope,
                'message': message,
                'user_data': {
                    'age': theage,
                    'sex': sex
                }
            }

