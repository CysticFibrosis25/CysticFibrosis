from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

from flask_jwt_extended import JWTManager

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    os.getenv("SECRET_KEY", "dev-secret-key")
)

jwt = JWTManager(app)

from routes.auth_routes import auth_bp
from routes.health_routes import health_bp
from routes.cf_routes import cf_bp
from routes.profile_routes import profile_bp
from routes.prediction_routes import pred_bp
from routes.chatbot_routes import chatbot
from routes.food_routes import food_bp
from routes.enzyme_routes import enzyme_bp
from routes.nutrition_routes import nutrition_bp
from routes.recipe_routes import recipe_bp
from routes.nutrition_lookup_routes import nutrition_lookup_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(health_bp, url_prefix="/api")
app.register_blueprint(cf_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(pred_bp, url_prefix="/api")
app.register_blueprint(chatbot, url_prefix="/api")
app.register_blueprint(food_bp, url_prefix="/api")
app.register_blueprint(enzyme_bp, url_prefix="/api")
app.register_blueprint(nutrition_bp, url_prefix="/api")
app.register_blueprint(recipe_bp, url_prefix="/api")
app.register_blueprint(nutrition_lookup_bp, url_prefix="/api")



@app.route("/", methods=["GET"])
def health_check():
    return {"status": "PulmoScan backend running"}, 200

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
    

