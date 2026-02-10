from datetime import timedelta
from flask import Blueprint, request, jsonify
from .services import analyze_image
import os
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "active", "service": "HealthGuard Vision API"}), 200

@main_bp.route('/re-auth' , methods=['POST'])
@jwt_required()
def re_auth():
    current_user = get_jwt_identity()
    print(f"Utilisateur connecté : {current_user}")
    access_token = create_access_token(identity=current_user, expires_delta=timedelta(hours=24))
    return jsonify({"token": access_token}), 200

@main_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    current_user = get_jwt_identity()
    print(f"Utilisateur connecté : {current_user}")
    if 'image' not in request.files:
        return jsonify({"error": "Aucune image envoyée"}), 400
    
    file = request.files['image']
    analysis_type = request.form.get('type') 

    try:
        result = analyze_image(file, analysis_type)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@main_bp.route('/auth', methods=['POST'])
def authenticate():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')



    if username == 'admin' and password == 'password':
        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=24))
        return jsonify({"token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    

