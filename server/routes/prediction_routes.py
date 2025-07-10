
# from flask import Blueprint, request, jsonify
# from services.prediction_service import PredictionService
# from models.user import User
# from database.db import db 

# pred_bp = Blueprint('predictions', __name__)
# user_model = User()

# @pred_bp.route('/predict', methods=['POST'])
# def handle_prediction():
#     if 'ct_scan' not in request.files:
#         return jsonify({"error": "No CT scan uploaded"}), 400
    
#     email = request.form.get('email')
#     fvc = request.form.get('fvc')

#     if not email or not fvc:
#         return jsonify({"error": "Missing email or FVC"}), 400

#     try:
#         user = user_model.get_user_details(email)
#         if not user:
#             return jsonify({"error": "User not found"}), 404

#         result = PredictionService.process_prediction(
#             request.files['ct_scan'],
#             user['email']  
#         )
#         return jsonify(result), 200
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500
    
# @pred_bp.route('/fvc-history', methods=['GET'])
# def get_fvc_history():
#     email = request.args.get('email')
#     if not email:
#         return jsonify({"error": "Email is required"}), 400

#     records = db.predictions.find(
#         {"user_email": email},
#         {"timestamp": 1, "fvc": 1, "slope": 1}  
#     ).sort("timestamp", 1)

#     history = []
#     for record in records:
#         fvc = record.get("fvc", None)
#         slope = record.get("slope", None)
#         timestamp = record.get("timestamp", None)

#         if fvc is not None and timestamp is not None:
#             history.append({
#                 "fvc": float(fvc),
#                 "slope": float(slope) if slope is not None else None,
#                 "timestamp": timestamp.isoformat()
#             })

#     return jsonify(history), 200



from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService
from models.user import User
from database.db import db 

pred_bp = Blueprint('predictions', __name__)
user_model = User()

@pred_bp.route('/predict', methods=['POST'])
def handle_prediction():
    if 'ct_scan' not in request.files:
        return jsonify({"error": "No CT scan uploaded"}), 400
    
    email = request.form.get('email')
    fvc = request.form.get('fvc')

    if not email or not fvc:
        return jsonify({"error": "Missing email or FVC"}), 400

    try:
        user = user_model.get_user_details(email)
        if not user:
            return jsonify({"error": "User  not found"}), 404

        result = PredictionService.process_prediction(
            request.files['ct_scan'],
            user['email']  # ✅ FIXED: Pass only the email string
        )
        return jsonify(result), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@pred_bp.route('/fvc-history', methods=['GET'])
def get_fvc_history():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    records = db.predictions.find(
        {"user_email": email},
        {"timestamp": 1, "fvc": 1, "slope": 1}
    ).sort("timestamp", 1)

    history = []
    for record in records:
        fvc = record.get("fvc")
        slope = record.get("slope")
        timestamp = record.get("timestamp")

        if fvc is not None and timestamp is not None:
            history.append({
                "fvc": float(fvc),
                "slope": float(slope) if slope is not None else 0.0,
                "timestamp": timestamp.isoformat()
            })

    return jsonify(history), 200

