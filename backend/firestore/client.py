import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

db = firestore.client()

def store_insight(data):
    return db.collection("daily_insights").add(data)
