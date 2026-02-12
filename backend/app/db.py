from flask_pymongo import PyMongo
from pymongo import ASCENDING
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

mongo = PyMongo()

def _serialize_datetime(value):
    """Convertit un datetime ou tout objet date en string ISO."""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, str):
        return value
    return str(value)

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
            "required": ["patient_id", "type", "created_at"],
            "properties": {
                "patient_id": {
                    "bsonType": "objectId"
                },
                "type": {
                    "enum": ["eye", "skin", "nail"]
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
    print(users)
    for user in users:
        user['_id'] = str(user['_id'])
        user.pop('password', None)
        if 'created_at' in user:
            user['created_at'] = _serialize_datetime(user['created_at'])
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
            if 'created_at' in user:
                user['created_at'] = _serialize_datetime(user['created_at'])
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
            if 'created_at' in user:
                user['created_at'] = _serialize_datetime(user['created_at'])
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


def create_history_entry(patient_id, analysis_type, message, hb_level=None):
    """
    Ajoute une entrée dans l'historique d'un patient.
    patient_id doit être l'ID (string) de l'utilisateur.
    """
    if isinstance(message, dict):
        message = ", ".join([f"{key}: {value}" for key, value in message.items()])
    elif isinstance(message, list):
        message = ", ".join(message)

    hb_level = str(hb_level) if hb_level else ""

    entry = {
        "patient_id": ObjectId(patient_id), 
        "type": analysis_type, 
        "message": message,
        "hb_level": hb_level, 
        "created_at": datetime.now(timezone.utc)
    }
    
    result = mongo.db.history.insert_one(entry)
    return str(result.inserted_id)

def get_patient_history(patient_id):
    """
    Récupère tout l'historique d'un patient spécifique.
    """
    try:
        history = list(mongo.db.history.find({"patient_id": ObjectId(patient_id)}).sort("created_at", -1))
        for item in history:
            item['_id'] = str(item['_id'])
            item['patient_id'] = str(item['patient_id'])
            if 'created_at' in item:
                item['created_at'] = _serialize_datetime(item['created_at'])
        return history
    except Exception:
        return []


def update_user_profile(user_email, firstname, lastname):
    """
    Met à jour le prénom et nom d'un utilisateur.
    """
    try:
        result = mongo.db.users.update_one(
            {"email": user_email},
            {"$set": {"firstname": firstname, "lastname": lastname}}
        )
        return result.modified_count > 0
    except Exception:
        return False


def change_user_password(user_email, old_password, new_password):
    """
    Change le mot de passe d'un utilisateur après vérification de l'ancien.
    """
    try:
        user = mongo.db.users.find_one({"email": user_email})
        if not user or not check_password_hash(user['password'], old_password):
            return False
        hashed = generate_password_hash(new_password)
        mongo.db.users.update_one(
            {"email": user_email},
            {"$set": {"password": hashed}}
        )
        return True
    except Exception:
        return False


def delete_user_history(patient_id):
    """
    Supprime tout l'historique d'un patient.
    """
    try:
        result = mongo.db.history.delete_many({"patient_id": ObjectId(patient_id)})
        return result.deleted_count
    except Exception:
        return 0


def get_user_stats(patient_id):
    """
    Récupère les statistiques d'un utilisateur (nombre de scans, date d'inscription).
    """
    try:
        scan_count = mongo.db.history.count_documents({"patient_id": ObjectId(patient_id)})
        return {"scan_count": scan_count}
    except Exception:
        return {"scan_count": 0}