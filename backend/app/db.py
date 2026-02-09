from flask_pymongo import PyMongo

mongo = PyMongo()

def init_db(app):
    mongo.init_app(app)
    if(mongo.db.command("ping")):
        print("MongoDB connecté avec succès !")