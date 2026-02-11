"""
module de prédiction médical unifié pour Health Guard
Gère l'analyse de 3 types d'images médicales :
- Ongles : Détection d'anémie
- Peau : Détection de maladies cutanées
- Yeux : Détection de problèmes oculaires (à venir)
"""

import os
import cv2
import numpy as np
import tensorflow as tf
import json
from PIL import Image
from typing import Dict, Tuple, Optional, List

# Obtenir le chemin du répertoire de ce script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


class MedicalAnalyzer:
    """
    Classe unifiée pour gérer l'analyse de différents types d'images médicales
    """
    
    def __init__(self):
        """Initialise l'analyseur médical"""
        self.models = {}
        self.supported_types = ['nail', 'skin', 'eye']
        
    def load_model(self, analysis_type: str):
        """
        Charge le modèle TFLite approprié selon le type d'analyse
        
        Args:
            analysis_type: Type d'analyse ('nail', 'skin', 'eye')
        """
        if analysis_type not in self.supported_types:
            raise ValueError(f"Type d'analyse non supporté: {analysis_type}. Types valides: {self.supported_types}")
        
        # Si le modèle est déjà chargé, le retourner
        if analysis_type in self.models:
            return self.models[analysis_type]
        
        # Chemins des modèles
        model_paths = {
            'nail': os.path.join(SCRIPT_DIR, "ml_models", "nail_anemia_model.tflite"),
            'skin': os.path.join(SCRIPT_DIR, "ml_models", "best_skin_disease_model.tflite"),
            'eye': os.path.join(SCRIPT_DIR, "ml_models", "eye_disease_model.tflite")
        }
        
        model_path = model_paths[analysis_type]
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Modèle non trouvé: {model_path}")
        
        # Charger le modèle TFLite
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        
        # Stocker le modèle
        self.models[analysis_type] = {
            'interpreter': interpreter,
            'input_details': interpreter.get_input_details(),
            'output_details': interpreter.get_output_details()
        }
        
        print(f"✓ Modèle {analysis_type} chargé avec succès")
        return self.models[analysis_type]
    
    def preprocess_image_nail(self, image_path: str) -> np.ndarray:
        """Prétraite une image d'ongle"""
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Impossible de lire l'image {image_path}")
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (224, 224))
        image = image / 255.0
        image = np.expand_dims(image, axis=0).astype(np.float32)
        
        return image
    
    def preprocess_image_skin(self, image_path: str, img_size: int = 224) -> np.ndarray:
        """Prétraite une image de peau"""
        img = Image.open(image_path)
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img = img.resize((img_size, img_size), Image.Resampling.LANCZOS)
        img_array = np.array(img)
        img_array = img_array.astype('float32') / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    def preprocess_image_eye(self, image_path: str) -> np.ndarray:
        """Prétraite une image d'œil"""
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Impossible de lire l'image {image_path}")
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (224, 224))
        image = image / 255.0
        image = np.expand_dims(image, axis=0).astype(np.float32)
        
        return image
    
    def analyze_nail(self, image_path: str, sexe: str) -> Dict:
        """
        Analyse une image d'ongle pour détecter l'anémie
        
        Args:
            image_path: Chemin vers l'image
            sexe: 'homme' ou 'femme'
        
        Returns:
            Dict avec les résultats de l'analyse
        """
        try:
            # Charger le modèle
            model = self.load_model('nail')
            
            # Prétraiter l'image
            image = self.preprocess_image_nail(image_path)
            
            # Faire la prédiction
            model['interpreter'].set_tensor(model['input_details'][0]['index'], image)
            model['interpreter'].invoke()
            prediction = model['interpreter'].get_tensor(model['output_details'][0]['index'])
            hb_level = float(prediction[0][0])
            
            # Interpréter les résultats selon le sexe
            result = self._interpret_nail_result(hb_level, sexe)
            result['analysis_type'] = 'nail'
            result['success'] = True
            
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'analysis_type': 'nail'
            }
    
    def analyze_skin(self, image_path: str, top_k: int = 3) -> Dict:
        """
        Analyse une image de peau pour détecter des maladies cutanées
        
        Args:
            image_path: Chemin vers l'image
            top_k: Nombre de prédictions à retourner
        
        Returns:
            Dict avec les résultats de l'analyse
        """
        try:
            # Charger le modèle
            model = self.load_model('skin')
            
            # Charger le mapping des classes
            class_mapping_path = os.path.join(SCRIPT_DIR, "ml_models", "class_mapping.json")
            if not os.path.exists(class_mapping_path):
                raise FileNotFoundError(f"Mapping des classes non trouvé: {class_mapping_path}")
            
            with open(class_mapping_path, 'r', encoding='utf-8') as f:
                class_mapping = json.load(f)
            class_mapping = {int(k): v for k, v in class_mapping.items()}
            
            # Prétraiter l'image
            image = self.preprocess_image_skin(image_path)
            
            # Faire la prédiction
            model['interpreter'].set_tensor(model['input_details'][0]['index'], image)
            model['interpreter'].invoke()
            predictions = model['interpreter'].get_tensor(model['output_details'][0]['index'])[0]
            
            # Obtenir les top K prédictions
            top_indices = np.argsort(predictions)[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                class_name = class_mapping[idx]
                probability = float(predictions[idx])
                results.append({
                    'disease': class_name,
                    'confidence': round(probability * 100, 2)
                })
            
            return {
                'success': True,
                'analysis_type': 'skin',
                'predictions': results,
                'primary_diagnosis': results[0]['disease'],
                'confidence': results[0]['confidence']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'analysis_type': 'skin'
            }
    
    def analyze_eye(self, image_path: str) -> Dict:
        """
        Analyse une image d'œil pour détecter des problèmes oculaires
        
        Args:
            image_path: Chemin vers l'image
        
        Returns:
            Dict avec les résultats de l'analyse
        """
        try:
            # Charger le modèle
            model = self.load_model('eye')
            
            # Prétraiter l'image
            image = self.preprocess_image_eye(image_path)
            
            # Faire la prédiction
            model['interpreter'].set_tensor(model['input_details'][0]['index'], image)
            model['interpreter'].invoke()
            prediction = model['interpreter'].get_tensor(model['output_details'][0]['index'])
            
            # TODO: Interpréter les résultats selon votre modèle d'œil
            # Ceci est un exemple, à adapter selon votre modèle
            
            return {
                'success': True,
                'analysis_type': 'eye',
                'message': 'Analyse d\'œil en cours de développement'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'analysis_type': 'eye'
            }
    
    def _interpret_nail_result(self, hb_level: float, sexe: str) -> Dict:
        """
        Interprète le niveau d'hémoglobine selon le sexe
        
        Args:
            hb_level: Niveau d'hémoglobine prédit en g/L
            sexe: 'homme' ou 'femme'
        
        Returns:
            Dict avec le diagnostic
        """
        # Seuils selon le sexe (en g/L)
        if sexe.lower() == "homme":
            seuil_anemie_severe = 80
            seuil_anemie_moderee = 100
            seuil_anemie_legere = 130
            seuil_normal_max = 170
        elif sexe.lower() == "femme":
            seuil_anemie_severe = 80
            seuil_anemie_moderee = 100
            seuil_anemie_legere = 120
            seuil_normal_max = 160
        else:
            raise ValueError(f"Sexe invalide: '{sexe}'. Attendu: 'homme' ou 'femme'.")
        
        hb_rounded = round(hb_level, 1)
        
        if hb_level < seuil_anemie_severe:
            return {
                "message": "Anémie sévère détectée, consultation médicale urgente recommandée",
                "hb_level": f"{hb_rounded} g/L",
                "severity": "severe",
                "status": "anemia"
            }
        elif hb_level < seuil_anemie_moderee:
            return {
                "message": "Anémie modérée détectée, consultation médicale recommandée rapidement",
                "hb_level": f"{hb_rounded} g/L",
                "severity": "moderate",
                "status": "anemia"
            }
        elif hb_level < seuil_anemie_legere:
            return {
                "message": "Anémie légère détectée, surveillance et consultation médicale conseillée",
                "hb_level": f"{hb_rounded} g/L",
                "severity": "light",
                "status": "anemia"
            }
        elif hb_level <= seuil_normal_max:
            return {
                "message": "Niveau d'hémoglobine normal, continuez à maintenir une alimentation équilibrée",
                "hb_level": f"{hb_rounded} g/L",
                "severity": None,
                "status": "normal"
            }
        else:
            return {
                "message": "Niveau d'hémoglobine élevé, consultation médicale pour vérification conseillée",
                "hb_level": f"{hb_rounded} g/L",
                "severity": None,
                "status": "elevated"
            }
    
    def analyze(self, image_path: str, analysis_type: str, **kwargs) -> Dict:
        """
        Fonction principale pour analyser une image selon le type spécifié
        
        Args:
            image_path: Chemin vers l'image
            analysis_type: Type d'analyse ('nail', 'skin', 'eye')
            **kwargs: Arguments additionnels (ex: sexe pour nail)
        
        Returns:
            Dict avec les résultats de l'analyse
        """
        if analysis_type == 'nail':
            sexe = kwargs.get('sexe', 'homme')
            return self.analyze_nail(image_path, sexe)
        elif analysis_type == 'skin':
            return self.analyze_skin(image_path)
        elif analysis_type == 'eye':
            return self.analyze_eye(image_path)
        else:
            return {
                'success': False,
                'error': f"Type d'analyse non supporté: {analysis_type}",
                'supported_types': self.supported_types
            }


# Créer une instance globale pour réutilisation
_analyzer = None

def get_analyzer() -> MedicalAnalyzer:
    """Retourne l'instance globale de l'analyseur (singleton)"""
    global _analyzer
    if _analyzer is None:
        _analyzer = MedicalAnalyzer()
    return _analyzer


# Fonctions legacy pour compatibilité avec l'ancienne API
def analyze_nail_image(image_path: str, sexe: str) -> Dict:
    """
    Fonction legacy pour l'analyse d'ongle (compatibilité)
    
    Args:
        image_path: Chemin vers l'image de l'ongle
        sexe: Sexe de la personne ('homme' ou 'femme')
    
    Returns:
        Dict avec les résultats de l'analyse
    """
    analyzer = get_analyzer()
    return analyzer.analyze_nail(image_path, sexe)
