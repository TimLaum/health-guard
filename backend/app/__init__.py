from flask import Flask
from .db import init_db
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager 
import os

def create_app():
    load_dotenv()
    
    app = Flask(__name__)
    
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/healthguard")
    app.config["UPLOAD_FOLDER"] = "./uploads"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key-a-changer")

    init_db(app)

    jwt = JWTManager(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app