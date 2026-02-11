from flask_pymongo import PyMongo
from pymongo import ASCENDING
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

mongo = PyMongo()

def init_db(app):
    mongo.init_app(app)
    
    if mongo.db.command("ping"):
        print("MongoDB connecte avec succes")

    if "users" not in mongo.db.list_collection_names():
         user_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["email", "password", "sex", "created_at"],
            "properties": {
                "email": {
                    "bsonType": "string"
                },
                "firstname": {
                    "bsonType": "string"
                },
                "lastname": {
                    "bsonType": "string"
                },
                "password": {
                    "bsonType": "string"
                },
                "sex": {
                    "enum": ["M", "F"]
                },
                "created_at": {
                    "bsonType": "date"
                }
            }
        }
    }
         mongo.db.create_collection("users", validator=user_validator)
         mongo.db.users.create_index([("email", ASCENDING)], unique=True)

   
    
    if "history" not in mongo.db.list_collection_names():
        history_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["patient_id", "image", "type", "created_at"],
            "properties": {
                "patient_id": {
                    "bsonType": "objectId"
                },
                "image": {
                    "bsonType": "string"
                },
                "type": {
                    "enum": ["eye", "skin", "nails"]
                },
                "message": {
                    "bsonType": "string"
                },
                "hb_level": {
                    "bsonType": "string"
                },
                "created_at": {
                    "bsonType": "date"
                }
            }
        }
    }
        mongo.db.create_collection("history", validator=history_validator)
        mongo.db.history.create_index([("patient_id", ASCENDING)])

   

    



def create_user(email, password, firstname, lastname, sex):
    """
    Crée un nouvel utilisateur avec mot de passe hashé.
    Retourne l'ID de l'utilisateur créé.
    """
    hashed_password = generate_password_hash(password)
    
    new_user = {
        "email": email,
        "password": hashed_password,
        "firstname": firstname,
        "lastname": lastname,
        "sex": sex,
        "created_at": datetime.now(timezone.utc)
    }
    
    result = mongo.db.users.insert_one(new_user)
    return str(result.inserted_id)

def get_all_users():
    """
    Récupère tous les utilisateurs.
    Convertit les ObjectId en string pour le JSON.
    """
    users = list(mongo.db.users.find())
    for user in users:
        user['_id'] = str(user['_id'])
        user.pop('password', None) 
    return users

def get_user_by_id(user_id):
    """
    Récupère un utilisateur par son ID MongoDB.
    """
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user['_id'] = str(user['_id'])
            user.pop('password', None)
        return user
    except Exception:
        return None
    
def get_user_by_email(user_email):
    """
    Récupère un utilisateur par son email MongoDB.
    """
    try:
        user = mongo.db.users.find_one({"email": user_email})
        if user:
            user['_id'] = str(user['_id'])
            user.pop('password', None)
        return user
    except Exception:
        return None

def authenticate_user(email, password):
    """
    Vérifie l'email et le mot de passe.
    Retourne l'objet user complet si OK, sinon None.
    """
    user = mongo.db.users.find_one({"email": email})
    
    if user and check_password_hash(user['password'], password):
        user['_id'] = str(user['_id'])
        return user
    
    return None


def create_history_entry(patient_id, image_path, analysis_type, message, hb_level=None):
    """
    Ajoute une entrée dans l'historique d'un patient.
    patient_id doit être l'ID (string) de l'utilisateur.
    """
    entry = {
        "patient_id": ObjectId(patient_id), 
        "image": image_path,
        "type": analysis_type, 
        "message": message,
        "hb_level": str(hb_level) if hb_level else None, 
        "created_at": datetime.now(timezone.utc)
    }
    
    result = mongo.db.history.insert_one(entry)
    return str(result.inserted_id)

def get_patient_history(patient_id):
    """
    Récupère tout l'historique d'un patient spécifique.
    """
    try:
        history = list(mongo.db.history.find({"patient_id": ObjectId(patient_id)}))
        for item in history:
            item['_id'] = str(item['_id'])
            item['patient_id'] = str(item['patient_id'])
        return history
    except Exception:
        return []