from flask import Blueprint, jsonify
from firestore.client import store_insight
from datetime import datetime

insight_bp = Blueprint('insight', __name__)

@insight_bp.route('/run', methods=['GET'])
def run_insight():
    now = datetime.utcnow().isoformat()
    dummy_data = {
        "timestamp": now,
        "message": "Daily insight run triggered"
    }
    store_insight(dummy_data)
    return jsonify({"status": "success", "data": dummy_data})
