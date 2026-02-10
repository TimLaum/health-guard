import os
import cv2
import numpy as np
import tensorflow as tf

# Obtenir le chemin du répertoire de ce script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

#  Charger le modèle TFLite

def load_model(model_path=None):
    """Charge le modèle TFLite"""
    if model_path is None:
        model_path = os.path.join(SCRIPT_DIR, "ml_models", "nail_anemia_model.tflite")
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter



# Prétraiter une image

def preprocess_image(image_path):
    """Charge et prépare une image pour la prédiction"""
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Impossible de lire l'image {image_path}")
    
    # Même preprocessing que pendant l'entraînement
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))
    image = image / 255.0
    
    # Ajouter dimension batch et convertir en float32
    image = np.expand_dims(image, axis=0).astype(np.float32)
    
    return image



# Faire une prédiction

def predict(interpreter, image_path):
    """Prédit le niveau d'hémoglobine à partir d'une image d'ongle"""
    image = preprocess_image(image_path)
    
    # Obtenir les détails d'entrée et de sortie
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Définir le tensor d'entrée
    interpreter.set_tensor(input_details[0]['index'], image)
    
    # Exécuter l'inférence
    interpreter.invoke()
    
    # Obtenir le résultat
    prediction = interpreter.get_tensor(output_details[0]['index'])
    hb_level = float(prediction[0][0])  # Convertir en nombre Python
    
    return hb_level



# Interpréter les résultats

def interpret_result(hb_level, sexe):
    """
    Interprète le niveau d'hémoglobine selon le sexe
    
    Args:
        hb_level (float): Niveau d'hémoglobine prédit en g/L
        sexe (str): 'homme' ou 'femme'
    
    Returns:
        dict: Résultat avec statut, sévérité et recommandation
    """
    # Seuils selon le sexe (en g/L)
    if sexe == "homme":
        seuil_anemie_severe = 80
        seuil_anemie_moderee = 100
        seuil_anemie_legere = 130
        seuil_normal_max = 170
        range_normal = "130-170 g/L"
    elif sexe == "femme":
        seuil_anemie_severe = 80
        seuil_anemie_moderee = 100
        seuil_anemie_legere = 120
        seuil_normal_max = 160
        range_normal = "120-160 g/L"
    else:
        raise ValueError(f"Sexe invalide: '{sexe}'. Attendu: 'homme' ou 'femme'.")
    
    # Déterminer le statut
    if hb_level < seuil_anemie_severe:
        return {
            "message": "Anémie sévère détectée, consultation médicale urgente recommandée",
            "hb_level": round(hb_level, 1)+" g/L"
        }
    elif hb_level < seuil_anemie_moderee:
        return {
            "message": "Anémie modérée détectée, consultation médicale recommandée rapidement",
            "hb_level": round(hb_level, 1)+" g/L"
        }
    elif hb_level < seuil_anemie_legere:
        return {
            "message": "Anémie légère détectée, surveillance et consultation médicale conseillée",
            "hb_level": round(hb_level, 1)+" g/L"
        }
    elif hb_level <= seuil_normal_max:
        return {
            "message": "Niveau d'hémoglobine normal, continuez à maintenir une alimentation équilibrée",
            "hb_level": round(hb_level, 1)+" g/L"
        }
    else:
        return {
            "message": "Niveau d'hémoglobine élevé, consultation médicale pour vérification conseillée",
            "hb_level": round(hb_level, 1)+" g/L"
        }



def analyze_nail_image(image_path, sexe, interpreter=None):
    """
    Fonction principale pour l'analyse d'image via API
    
    Args:
        image_path (str): Chemin vers l'image de l'ongle
        sexe (str): Sexe de la personne ('homme' ou 'femme')
        interpreter: Interpréteur TFLite (optionnel, sera chargé si non fourni)
    
    Returns:
        dict: Résultats complets de l'analyse
    """
    # Charger le modèle si nécessaire
    if interpreter is None:
        interpreter = load_model()
    
    # Faire la prédiction
    hb_level = predict(interpreter, image_path)
    
    # Interpréter les résultats
    result = interpret_result(hb_level, sexe)
    
    return result
