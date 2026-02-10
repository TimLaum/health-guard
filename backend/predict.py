import os
import cv2
import numpy as np
import tensorflow as tf



#  Charger le modèle TFLite

def load_model(model_path="nail_anemia_model.tflite"):
    """Charge le modèle TFLite"""
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

def interpret_result(hb_level, sexe=None):
    """Interprète le niveau d'hémoglobine"""
    # Niveaux normaux d'hémoglobine en g/L
    if hb_level < 110:
        status = "ANÉMIE DÉTECTÉE"
        severity = "Sévère" if hb_level < 80 else "Modérée" if hb_level < 100 else "Légère"
        return f"{status} ({severity})"
    elif hb_level < 120:
        return "Limite inférieure (surveillance recommandée)"
    elif hb_level < 160:
        return "Normal"
    else:
        return "Élevé (vérification recommandée)"



# Utilisation

if __name__ == "__main__":
    # Charger le modèle TFLite
    print("Chargement du modèle TFLite...")
    interpreter = load_model("nail_anemia_model.tflite")
    print(f"Modèle TFLite chargé avec succès")
    
    # Exemple 1 : Prédiction sur une seule image
    image_path = "./dataset/photo/1.jpg"  # Modifier avec votre image
    
    if os.path.exists(image_path):
        print(f"\n Analyse de l'image: {image_path}")
        hb_predicted = predict(interpreter, image_path)
        
        print(f"┌{'─'*50}┐")
        print(f"│  Niveau d'hémoglobine prédit: {hb_predicted:.1f} g/L{' '*8}│")
        print(f"│  Statut: {interpret_result(hb_predicted):<36}│")
        print(f"└{'─'*50}┘")
    else:
        print(f"Image non trouvée: {image_path}")
    
    # Exemple 2 : Prédiction sur plusieurs images
    print("\n" + "="*52)
    print("ANALYSE DE PLUSIEURS IMAGES")
    print("="*52)
    
    test_images = ["./dataset/photo/1.jpg", "./dataset/photo/4.jpg", "./dataset/photo/3.jpg"]
    
    for img_path in test_images:
        if os.path.exists(img_path):
            hb = predict(interpreter, img_path)
            filename = os.path.basename(img_path)
            print(f"{filename:15} → {hb:6.1f} g/L  {interpret_result(hb)}")
        else:
            print(f"{img_path} non trouvé")
    
    print("\nUtilisation en code:")
    print("  from predict import load_model, predict")
    print("  interpreter = load_model('nail_anemia_model.tflite')")
    print("  hb_level = predict(interpreter, 'votre_image.jpg')")
