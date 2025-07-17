import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {'projectId': 'investment-advisor-bot-2025'})

db = firestore.client()

def store_insight(data):
    return db.collection("daily_insights").add(data)

def get_insights():
    docs = db.collection("daily_insights").order_by("timestamp", direction=firestore.Query.DESCENDING).limit(10).stream()
    insights = []
    for doc in docs:
        insight_data = doc.to_dict()
        insight_data['id'] = doc.id
        insights.append(insight_data)
    return insights
