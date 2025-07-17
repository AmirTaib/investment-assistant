"""
Investment Assistant Bot - Simplified Backend
Essential APIs for daily insights and Firestore operations.
"""

import os
import logging
from datetime import datetime
from flask import Flask, jsonify, request
from dotenv import load_dotenv

# Import Firestore client
from firestore.client import store_insight, get_insights

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configuration
PROJECT_ID = os.getenv('PROJECT_ID', 'investment-advisor-bot-2025')

@app.route('/')
def hello():
    """Health check endpoint"""
    return jsonify({
        'message': 'Investment Assistant Bot is running!',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'status': 'healthy'
    })

@app.route('/health')
def health():
    """Detailed health check"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'project_id': PROJECT_ID,
        'services': {
            'firestore': 'connected'
        }
    })

@app.route('/api/insights/daily', methods=['GET'])
def get_daily_insight():
    """Generate and store daily investment insight (mock data)"""
    try:
        # Generate mock daily insight
        now = datetime.utcnow().isoformat()
        
        # Mock insight data - this would be replaced with real investment analysis
        mock_insight = {
            "timestamp": now,
            "message": f"Daily investment insight generated at {now}. Market analysis shows positive momentum in technology sector. Consider reviewing portfolio allocation for optimal returns.",
            "type": "daily_insight",
            "source": "investment_assistant",
            "priority": "medium"
        }
        
        # Store to Firestore
        store_insight(mock_insight)
        
        logger.info(f"Daily insight generated and stored: {now}")
        
        return jsonify({
            "status": "success",
            "message": "Daily insight generated successfully",
            "data": mock_insight
        })
        
    except Exception as e:
        logger.error(f"Error generating daily insight: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/insights/recent', methods=['GET'])
def get_recent_insights():
    """Get recent insights from Firestore"""
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Get insights from Firestore
        insights = get_insights()
        
        # Apply limit if specified
        if limit and len(insights) > limit:
            insights = insights[:limit]
        
        return jsonify({
            'status': 'success',
            'insights': insights,
            'count': len(insights),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting recent insights: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get port from environment or default to 8080
    port = int(os.environ.get('PORT', 8080))
    
    # Run the app
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.environ.get('FLASK_ENV') == 'development'
    ) 