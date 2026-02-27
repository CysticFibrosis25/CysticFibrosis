
from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService
from models.user import User
from database.db import db 


pred_bp = Blueprint('predictions', __name__)
user_model = User()

from flask_cors import CORS
CORS(pred_bp)

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
            return jsonify({"error": "User not found"}), 404

        result = PredictionService.process_prediction(
            request.files['ct_scan'],
            user['email']  
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
        fvc = record.get("fvc", None)
        slope = record.get("slope", None)
        timestamp = record.get("timestamp", None)

        if fvc is not None and timestamp is not None:
            history.append({
                "fvc": float(fvc),
                "slope": float(slope) if slope is not None else None,
                "timestamp": timestamp.isoformat()
            })

    return jsonify(history), 200



# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from services.prediction_service import PredictionService
# from models.user import User
# from database.db import db 
# from bson import ObjectId

# pred_bp = Blueprint('predictions', __name__)
# user_model = User()

# @pred_bp.route('/predict', methods=['POST'])
# @jwt_required(optional=True)
# def handle_prediction():
#     if 'ct_scan' not in request.files:
#         return jsonify({"error": "No CT scan uploaded"}), 400
    
#     user_id=get_jwt_identity()
#     email = request.form.get('email')
#     fvc = request.form.get('fvc')
#     ct_zip = request.files['ct_scan']

#     if not email or not fvc:
#         return jsonify({"error": "Missing email or FVC"}), 400

#     try:
#         user = user_model.get_user_details(email)
#         if not user:
#             return jsonify({"error": "User  not found"}), 404

#         result = PredictionService.process_prediction(
#             request.files['ct_scan'],
#             user['email']  # ✅ FIXED: Pass only the email string
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
#         fvc = record.get("fvc")
#         slope = record.get("slope")
#         timestamp = record.get("timestamp")

#         if fvc is not None and timestamp is not None:
#             history.append({
#                 "fvc": float(fvc),
#                 "slope": float(slope) if slope is not None else 0.0,
#                 "timestamp": timestamp.isoformat()
#             })

#     return jsonify(history), 200

# from flask import Blueprint, request, jsonify
# from services.prediction_service import PredictionService
# from models.user import User
# from database.db import db
# from bson import ObjectId



# pred_bp = Blueprint("predictions", __name__)
# user_model = User()

# from flask_cors import CORS
# CORS(pred_bp)

# # PREDICT FVC SLOPE (CT ZIP UPLOAD)
# @pred_bp.route("/predict", methods=["POST"])
# def handle_prediction():

#     if "ct_scan" not in request.files:
#         return jsonify({"error": "No CT scan uploaded"}), 400

#     ct_zip = request.files["ct_scan"]
#     fvc = request.form.get("fvc")

#     email = request.form.get("email")

#     user = None

#     # Preferred: JWT
#     if email:
#         user = user_model.get_user_by_id()
#         if user:
#             email = user.get("email")

#     # Legacy fallback: email
#     if not user and email:
#         user = user_model.get_user_details(email)

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     if not fvc:
#         return jsonify({"error": "Missing FVC"}), 400

#     # RUN ORIGINAL PREDICTION LOGIC
#     try:
#         result = PredictionService.process_prediction(
#             ct_zip_file=ct_zip,
#             email=email  # ORIGINAL SIGNATURE PRESERVED
#         )

#         return jsonify(result), 200

#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# # FETCH FVC HISTORY (UNCHANGED LOGIC)
# @pred_bp.route("/fvc-history", methods=["GET"])
# @jwt_required(optional=True)
# def get_fvc_history():

#     user_id = get_jwt_identity()
#     email = request.args.get("email")

#     # Resolve email from JWT if possible
#     if user_id:
#         user = user_model.get_user_by_id(user_id)
#         if user:
#             email = user.get("email")

#     if not email:
#         return jsonify({"error": "Email is required"}), 400

#     records = db.predictions.find(
#         {"user_email": email},
#         {"timestamp": 1, "fvc": 1, "slope": 1}
#     ).sort("timestamp", 1)

#     history = []

#     for record in records:
#         if record.get("timestamp") and record.get("fvc") is not None:
#             history.append({
#                 "fvc": float(record.get("fvc")),
#                 "slope": float(record.get("slope", 0.0)),
#                 "timestamp": record["timestamp"].isoformat()
#             })

#     return jsonify(history), 200
