from datetime import timedelta
from app.db import authenticate_user, create_history_entry, create_user, get_all_users, get_patient_history, get_user_by_email, update_user_profile, change_user_password, delete_user_history, get_user_stats
from flask import Blueprint, request, jsonify
from .services import analyze_image
import os
import traceback
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

    user = get_user_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'image' not in request.files:
        return jsonify({"error": "Aucune image envoyée"}), 400
    
    file = request.files['image']
    analysis_type = request.form.get('type') 

    if not analysis_type or analysis_type not in ['eye', 'skin', 'nail']:
        return jsonify({"error": "Type d'analyse manquant ou invalide (eye, skin, nail)"}), 400

    try:
        result = analyze_image(file, analysis_type, user['sex'])
        if not result:
            return jsonify({"error": "Analyse échouée, résultat vide"}), 500

        # Extract message and hb_level for history
        if analysis_type == 'skin':
            message = result.get('primary_diagnosis', '')
            hb_level = None
        else:
            message = result.get('message', '')
            hb_level = result.get('hb_level')

        create_history_entry(user['_id'], analysis_type, message, hb_level)
        return jsonify(result), 200
    except Exception as e:
        traceback.print_exc()
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
    

@main_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = get_user_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404
    stats = get_user_stats(user['_id'])
    user['scan_count'] = stats['scan_count']
    return jsonify(user), 200


@main_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    if not firstname or not lastname:
        return jsonify({"error": "Le prénom et le nom sont requis"}), 400

    success = update_user_profile(current_user, firstname, lastname)
    if not success:
        return jsonify({"error": "Échec de la mise à jour du profil"}), 500

    user = get_user_by_email(current_user)
    return jsonify(user), 200


@main_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user = get_jwt_identity()
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({"error": "Les deux mots de passe sont requis"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Le nouveau mot de passe doit contenir au moins 6 caractères"}), 400

    success = change_user_password(current_user, old_password, new_password)
    if not success:
        return jsonify({"error": "Ancien mot de passe incorrect"}), 401

    return jsonify({"message": "Mot de passe modifié avec succès"}), 200


@main_bp.route('/export-data', methods=['GET'])
@jwt_required()
def export_data():
    current_user = get_jwt_identity()
    user = get_user_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    history = get_patient_history(user['_id'])
    export = {
        "user": {
            "firstname": user.get('firstname', ''),
            "lastname": user.get('lastname', ''),
            "email": user.get('email', ''),
            "sex": user.get('sex', ''),
            "created_at": user.get('created_at', ''),
        },
        "history": history,
        "exported_at": __import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat()
    }
    return jsonify(export), 200


@main_bp.route('/delete-history', methods=['DELETE'])
@jwt_required()
def delete_all_history():
    current_user = get_jwt_identity()
    user = get_user_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    deleted = delete_user_history(user['_id'])
    return jsonify({"message": f"{deleted} entrée(s) supprimée(s)"}), 200


@main_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = get_all_users()
    return jsonify(users), 200

@main_bp.route('/histories', methods=['GET'])
@jwt_required()
def fetch_history():
    current_user = get_jwt_identity()
    user = get_user_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    history = get_patient_history(user['_id'])
    return jsonify(history), 200


@main_bp.route('/history/<user_id>', methods=['GET'])
@jwt_required()
def get_history(user_id):
    current_user = get_jwt_identity()
    user = get_user_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    history = get_patient_history(user_id)
    return jsonify(history), 200