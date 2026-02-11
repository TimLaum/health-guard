from datetime import timedelta
from app.db import authenticate_user, create_user, get_all_users, get_user_by_email
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

@main_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    sex = data.get('sex')
    if not email or not password or not sex or not firstname or not lastname:
        return jsonify({"error": "Missing required fields"}), 400
    
    if sex not in ['M', 'F']:
        return jsonify({"error": "Invalid sex value, must be 'M' or 'F'"}), 400
    
    if get_user_by_email(email) :
        return jsonify({"error": "Email already exists"}), 400
    
    create_user(email, password, firstname, lastname, sex)
    return jsonify({"message": "User created successfully"}), 201


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
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    if not authenticate_user(email, password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=email, expires_delta=timedelta(hours=24))
    return jsonify({"token": access_token}), 200
    

@main_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = get_all_users()
    return jsonify(users), 200