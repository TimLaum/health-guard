from flask import Blueprint, request, jsonify
from .services import analyze_image
import os

main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "active", "service": "HealthGuard Vision API"}), 200

@main_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "Aucune image envoyée"}), 400
    
    file = request.files['image']
    analysis_type = request.form.get('type') 

    try:
        result = analyze_image(file, analysis_type)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500