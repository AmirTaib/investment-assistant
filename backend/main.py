# -*- coding: utf-8 -*-
"""
Investment Assistant Bot - Simplified Backend
Essential APIs for daily insights and Firestore operations.
"""

import os
import logging
import requests
import json
from datetime import datetime
from flask import Flask, jsonify, request
from dotenv import load_dotenv

# Import Firestore client
from firestore.client import store_insight, get_insights
from context import get_prompt
from context_afternoon import get_afternoon_prompt
from email_service import EmailService
from config_service import config_service

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
config = config_service.get_config()
PROJECT_ID = config.get('PROJECT_ID', 'investment-advisor-bot-2025')
OPENAI_API_KEY = config.get('OPENAI_API_KEY')

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
            'firestore': 'connected',
            'openai': 'configured' if OPENAI_API_KEY else 'not_configured'
        }
    })

def generate_investment_insight():
    """Generate investment insight using ChatGPT API with detailed context"""
    prompt = get_prompt()
    if not OPENAI_API_KEY:
        logger.error("OpenAI API key not configured")
        raise Exception("OpenAI API key not configured")
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'gpt-4o',
        'messages': [
            {
                'role': 'system',
                'content': 'You are a professional investment advisor specializing in Israeli and US markets. Provide precise, actionable recommendations with specific amounts and detailed analysis. Focus on market-beating opportunities, not generic advice. ALWAYS return valid JSON only, no additional text.'
            },
            {
                'role': 'user',
                'content': prompt
            }
        ],
        'temperature': 0.7,
        'max_tokens': 4000
    }
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers=headers,
        json=data,
        timeout=30
    )
    if response.status_code == 200:
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Try to extract JSON from the response with multiple strategies
        json_str = None
        
        # Strategy 1: Look for JSON between curly braces
        try:
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                insight_data = json.loads(json_str)
                logger.info("Successfully parsed JSON using curly brace extraction")
                # Add metadata
                insight_data['source'] = 'investment_assistant'
                insight_data['generated_at'] = datetime.utcnow().isoformat()
                insight_data['type'] = 'daily_insight'
                return insight_data
        except json.JSONDecodeError as e:
            logger.warning(f"Strategy 1 failed: {e}")
        
        # Strategy 2: Try to clean the content and parse
        try:
            # Remove any markdown formatting
            cleaned_content = content.replace('```json', '').replace('```', '').strip()
            insight_data = json.loads(cleaned_content)
            logger.info("Successfully parsed JSON using cleaned content")
            # Add metadata
            insight_data['source'] = 'investment_assistant'
            insight_data['generated_at'] = datetime.utcnow().isoformat()
            insight_data['type'] = 'daily_insight'
            return insight_data
        except json.JSONDecodeError as e:
            logger.warning(f"Strategy 2 failed: {e}")
        
        # Strategy 3: Try to fix common JSON issues
        try:
            # Replace problematic characters and fix common issues
            fixed_content = content
            # Remove any text before the first {
            start_idx = fixed_content.find('{')
            if start_idx != -1:
                fixed_content = fixed_content[start_idx:]
            # Remove any text after the last }
            end_idx = fixed_content.rfind('}')
            if end_idx != -1:
                fixed_content = fixed_content[:end_idx + 1]
            
            # Fix common Hebrew text issues
            fixed_content = fixed_content.replace('\n', ' ').replace('\r', ' ')
            # Remove any trailing commas before closing braces
            import re
            fixed_content = re.sub(r',(\s*[}\]])', r'\1', fixed_content)
            
            insight_data = json.loads(fixed_content)
            logger.info("Successfully parsed JSON using fixed content")
            # Add metadata
            insight_data['source'] = 'investment_assistant'
            insight_data['generated_at'] = datetime.utcnow().isoformat()
            insight_data['type'] = 'daily_insight'
            return insight_data
        except json.JSONDecodeError as e:
            logger.error(f"All JSON parsing strategies failed. Last error: {e}")
            logger.error(f"Content received: {content[:500]}...")
            raise Exception(f"Failed to parse JSON from ChatGPT response after multiple attempts: {e}")
    else:
        logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
        raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")

@app.route('/api/insights/daily', methods=['GET'])
def get_daily_insight():
    """Generate and store daily investment insight using ChatGPT"""
    try:
        # Generate insight using ChatGPT
        insight_data = generate_investment_insight()
        # Store to Firestore
        store_insight(insight_data)
        logger.info(f"Daily insight generated and stored: {insight_data.get('timestamp', 'N/A')}")
        return jsonify({
            "status": "success",
            "message": "Daily insight generated successfully",
            "data": insight_data
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

def generate_afternoon_insight(time_of_day: str = "1:00 PM"):
    """Generate afternoon investment insight using specialized prompt"""
    prompt = get_afternoon_prompt(time_of_day)
    if not OPENAI_API_KEY:
        logger.error("OpenAI API key not configured")
        raise Exception("OpenAI API key not configured")
    
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'gpt-4o',
        'messages': [
            {
                'role': 'system',
                'content': 'You are a professional investment advisor specializing in Israeli and US markets. Provide precise, actionable recommendations with specific amounts and detailed analysis. Focus on market-beating opportunities, not generic advice. ALWAYS return valid JSON only, no additional text.'
            },
            {
                'role': 'user',
                'content': prompt
            }
        ],
        'temperature': 0.7,
        'max_tokens': 4000
    }
    
    logger.info(f"Sending request to OpenAI for {time_of_day} update")
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers=headers,
        json=data,
        timeout=30
    )
    
    logger.info(f"OpenAI response status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        logger.info(f"OpenAI response content length: {len(content)}")
        logger.info(f"OpenAI response content preview: {content[:200]}...")
        
        # Parse JSON response
        try:
            # Handle responses wrapped in markdown code blocks
            if content.strip().startswith('```'):
                # Extract JSON from markdown code blocks
                lines = content.strip().split('\n')
                json_lines = []
                in_json = False
                for line in lines:
                    if line.strip().startswith('```json') or line.strip().startswith('```'):
                        if in_json:
                            break
                        in_json = True
                        continue
                    if in_json:
                        json_lines.append(line)
                content = '\n'.join(json_lines)
            
            insight_data = json.loads(content)
            # Add metadata
            insight_data['source'] = 'investment_assistant'
            insight_data['generated_at'] = datetime.utcnow().isoformat()
            insight_data['type'] = f'afternoon_insight_{time_of_day.replace(":", "").replace(" ", "_").lower()}'
            insight_data['time_of_day'] = time_of_day
            return insight_data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from afternoon insight: {e}")
            logger.error(f"Raw content: {content}")
            raise Exception(f"Failed to parse JSON from afternoon insight: {e}")
    else:
        logger.error(f"OpenAI API error for afternoon insight: {response.status_code} - {response.text}")
        raise Exception(f"OpenAI API error for afternoon insight: {response.status_code} - {response.text}")

@app.route('/api/insights/afternoon/midday', methods=['GET'])
def get_midday_insight():
    """Generate midday investment insight (1:00 PM) and send email if significant changes detected"""
    try:
        # Check if midday updates are enabled
        if not config.get('AFTERNOON_UPDATE_1PM', True):
            return jsonify({'error': 'Midday updates are disabled'}), 400
        
        # Generate afternoon insight
        insight_data = generate_afternoon_insight("1:00 PM")
        
        # Check if there are significant changes
        update_summary = insight_data.get('update_summary', {})
        has_significant_changes = update_summary.get('has_significant_changes', False)
        
        if has_significant_changes:
            # Store insight to Firestore
            store_insight(insight_data)
            
            # Send email notification
            email_service = EmailService()
            email_sent = email_service.send_intelligent_update("1:00 PM")
            
            logger.info(f"Midday insight generated with significant changes. Email sent: {email_sent}")
            
            return jsonify({
                "status": "success",
                "message": "Midday insight generated and email sent",
                "has_significant_changes": True,
                "email_sent": email_sent,
                "data": insight_data
            })
        else:
            # Don't store or send email if no significant changes
            logger.info("No significant changes detected for midday update - skipping storage and email")
            
            return jsonify({
                "status": "success",
                "message": "No significant changes detected for midday - update skipped",
                "has_significant_changes": False,
                "email_sent": False,
                "data": insight_data
            })
            
    except Exception as e:
        logger.error(f"Error generating midday insight: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/insights/afternoon/end-of-day', methods=['GET'])
def get_end_of_day_insight():
    """Generate end-of-day investment insight (5:00 PM) and send email if significant changes detected"""
    try:
        # Check if end-of-day updates are enabled
        if not config.get('AFTERNOON_UPDATE_5PM', True):
            return jsonify({'error': 'End-of-day updates are disabled'}), 400
        
        # Generate afternoon insight
        insight_data = generate_afternoon_insight("5:00 PM")
        
        # Check if there are significant changes
        update_summary = insight_data.get('update_summary', {})
        has_significant_changes = update_summary.get('has_significant_changes', False)
        
        if has_significant_changes:
            # Store insight to Firestore
            store_insight(insight_data)
            
            # Send email notification
            email_service = EmailService()
            email_sent = email_service.send_intelligent_update("5:00 PM")
            
            logger.info(f"End-of-day insight generated with significant changes. Email sent: {email_sent}")
            
            return jsonify({
                "status": "success",
                "message": "End-of-day insight generated and email sent",
                "has_significant_changes": True,
                "email_sent": email_sent,
                "data": insight_data
            })
        else:
            # Don't store or send email if no significant changes
            logger.info("No significant changes detected for end-of-day update - skipping storage and email")
            
            return jsonify({
                "status": "success",
                "message": "No significant changes detected for end-of-day - update skipped",
                "has_significant_changes": False,
                "email_sent": False,
                "data": insight_data
            })
            
    except Exception as e:
        logger.error(f"Error generating end-of-day insight: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/email/test', methods=['POST'])
def test_email():
    """Test email functionality"""
    try:
        data = request.get_json()
        subject = data.get('subject', 'Test Email from Investment Assistant')
        body = data.get('body', 'This is a test email from the Investment Assistant system.')
        
        email_service = EmailService()
        success = email_service.send_gmail(subject, body)
        
        return jsonify({
            "status": "success" if success else "error",
            "message": "Test email sent successfully" if success else "Failed to send test email",
            "email_sent": success
        })
        
    except Exception as e:
        logger.error(f"Error sending test email: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/config/status', methods=['GET'])
def get_config_status():
    """Get configuration status and validation"""
    try:
        config = config_service.get_config()
        issues = []
        
        # Check required fields
        required_fields = ['PROJECT_ID', 'RECIPIENT_EMAIL', 'OPENAI_API_KEY']
        for field in required_fields:
            if not config.get(field):
                issues.append(f"Missing required field: {field}")
        
        return jsonify({
            'status': 'success',
            'config_source': "GCP Secret Manager" if config_service.get_config_secret() else "Environment Variables",
            'config_valid': len(issues) == 0,
            'issues': issues,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error getting config status: {str(e)}")
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