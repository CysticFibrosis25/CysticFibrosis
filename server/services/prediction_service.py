import os
import tempfile
import zipfile
from flask import request
from flask import jsonify
from datetime import datetime
from ml.predict import predict
from database.db import db  # Your existing MongoDB connection

class PredictionService:
    @staticmethod
    def process_prediction(ct_zip_file, email): #user_data
        # 1. Get user from MongoDB
        user = db.users.find_one({"email": email}) #user_data['email']
        if not user:
            raise ValueError("User not found")

        # 2. Validate required fields
        if not all([user.get('age'), user.get('sex')]):
            raise ValueError("Missing age/sex in user profile")

        # 3. Process CT scan
        with tempfile.TemporaryDirectory() as temp_dir:
            zip_path = os.path.join(temp_dir, 'upload.zip')
            ct_zip_file.save(zip_path)
            
            with zipfile.ZipFile(zip_path, 'r') as z:
                z.extractall(temp_dir)
            
            # 4. Run prediction (using your existing predict function)
            slope, message = predict(
                patient_folder=temp_dir,
                age=user['age'],
                sex=user['sex'],
                fvc=float(request.form.get('fvc', 0))  # Optional FVC from form
            )
            
            # 5. Save to predictions collection
            prediction_record = {
                'user_email': email, #user_data['email']
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
                    'age': user['age'],
                    'sex': user['sex']
                }
            }

