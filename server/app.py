from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from dotenv import load_dotenv
import os
# Add at the top:
from routes.prediction_routes import pred_bp



load_dotenv()

app = Flask(__name__)
from flask_cors import CORS
CORS(app, supports_credentials=True) 


app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(pred_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)