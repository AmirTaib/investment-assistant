from google.cloud import firestore
from datetime import datetime

def write_hello_message():
    db = firestore.Client()
    doc_ref = db.collection("daily_logs").document()
    doc_ref.set({
        "timestamp": datetime.utcnow().isoformat(),
        "message": "Hello from Cloud Run!"
    })
