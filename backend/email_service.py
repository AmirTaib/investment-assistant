# -*- coding: utf-8 -*-
"""
Email Service for Investment Assistant
Handles intelligent email notifications using GCP services
"""

import os
import logging
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from google.cloud import secretmanager
from google.cloud import firestore
import requests

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        from config_service import config_service
        config = config_service.get_config()
        self.project_id = config.get('PROJECT_ID', 'investment-advisor-bot-2025')
        self.recipient_email = config.get('RECIPIENT_EMAIL', 'amirtaib@gmail.com')
        self.secret_name = config.get('SECRET_NAME', 'investment-bot-service-secret-key')
        self.db = firestore.Client()
        
    def get_gmail_credentials(self) -> Dict:
        """Get Gmail credentials from Secret Manager"""
        try:
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/{self.project_id}/secrets/{self.secret_name}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            return json.loads(response.payload.data.decode("UTF-8"))
        except Exception as e:
            logger.error(f"Failed to get Gmail credentials: {e}")
            raise
    
    def send_gmail(self, subject: str, body: str, html_body: str = None) -> bool:
        """Send email using Gmail API"""
        try:
            credentials = self.get_gmail_credentials()
            
            # Gmail API endpoint
            url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
            
            # Create email message
            message = {
                "raw": self._create_message(
                    to=self.recipient_email,
                    subject=subject,
                    body=body,
                    html_body=html_body
                )
            }
            
            # Send request
            headers = {
                "Authorization": f"Bearer {credentials.get('access_token')}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, headers=headers, json=message, timeout=30)
            
            if response.status_code == 200:
                logger.info(f"Email sent successfully: {subject}")
                return True
            else:
                logger.error(f"Failed to send email: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False
    
    def _create_message(self, to: str, subject: str, body: str, html_body: str = None) -> str:
        """Create base64 encoded email message"""
        import base64
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        message = MIMEMultipart('alternative')
        message['to'] = to
        message['subject'] = subject
        
        # Add text part
        text_part = MIMEText(body, 'plain', 'utf-8')
        message.attach(text_part)
        
        # Add HTML part if provided
        if html_body is not None:
            html_part = MIMEText(html_body, 'html', 'utf-8')
            message.attach(html_part)
        
        # Encode to base64
        return base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
    
    def get_recent_insights(self, hours_back: int = 24) -> List[Dict]:
        """Get recent insights from Firestore"""
        try:
            # Get insights from the last N hours
            cutoff_time = datetime.utcnow() - timedelta(hours=hours_back)
            
            # Query Firestore for recent insights
            insights_ref = self.db.collection('daily_insights')
            query = insights_ref.where('timestamp', '>=', cutoff_time.isoformat())
            docs = query.stream()
            
            insights = []
            for doc in docs:
                insight_data = doc.to_dict()
                insight_data['id'] = doc.id
                insights.append(insight_data)
            
            return insights
            
        except Exception as e:
            logger.error(f"Error getting recent insights: {e}")
            return []
    
    def has_significant_changes(self, current_insights: List[Dict], previous_insights: List[Dict]) -> Tuple[bool, List[str]]:
        """Check if there are significant changes that warrant an email"""
        changes = []
        
        if not previous_insights:
            # First time running, consider it significant
            return True, ["First insight generation"]
        
        # Compare current vs previous insights
        current_symbols = set()
        previous_symbols = set()
        
        # Extract symbols from current insights
        for insight in current_insights:
            if 'recommendations' in insight:
                for rec in insight['recommendations']:
                    if 'symbol' in rec:
                        current_symbols.add(rec['symbol'])
        
        # Extract symbols from previous insights
        for insight in previous_insights:
            if 'recommendations' in insight:
                for rec in insight['recommendations']:
                    if 'symbol' in rec:
                        previous_symbols.add(rec['symbol'])
        
        # Check for new recommendations
        new_symbols = current_symbols - previous_symbols
        if new_symbols:
            changes.append(f"New recommendations for: {', '.join(new_symbols)}")
        
        # Check for removed recommendations
        removed_symbols = previous_symbols - current_symbols
        if removed_symbols:
            changes.append(f"Removed recommendations for: {', '.join(removed_symbols)}")
        
        # Check for significant market changes
        for insight in current_insights:
            if 'market_overview' in insight:
                market = insight['market_overview']
                if market.get('sentiment') in ['bearish', 'very_bearish']:
                    changes.append("Market sentiment turned bearish")
                elif market.get('sentiment') in ['bullish', 'very_bullish']:
                    changes.append("Market sentiment turned bullish")
        
        # Check for high-priority alerts
        for insight in current_insights:
            if 'alerts' in insight:
                for alert in insight['alerts']:
                    if alert.get('priority') in ['high', 'critical']:
                        changes.append(f"High priority alert: {alert.get('title', 'Unknown')}")
        
        return len(changes) > 0, changes
    
    def create_email_content(self, insights: List[Dict], changes: List[str], time_of_day: str) -> Tuple[str, str, str]:
        """Create email subject and content"""
        subject = f"🔔 Investment Update - {time_of_day} - {len(changes)} Important Changes"
        
        # Create HTML content
        html_content = f"""
        <html dir="rtl">
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .header {{ background-color: #007AFF; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .change-item {{ background-color: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 4px solid #007AFF; }}
                .insight-card {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }}
                .recommendation {{ background-color: #e8f5e8; padding: 10px; margin: 5px 0; border-radius: 4px; }}
                .alert {{ background-color: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #ffc107; }}
                .timestamp {{ color: #666; font-size: 0.9em; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Investment Assistant Update</h1>
                <p class="timestamp">{datetime.now().strftime('%Y-%m-%d %H:%M')} - {time_of_day}</p>
            </div>
            
            <div class="content">
                <h2>🔄 Changes Detected</h2>
                <p>The following important changes were detected since the last update:</p>
                {''.join([f'<div class="change-item">• {change}</div>' for change in changes])}
                
                <h2>📈 Latest Insights</h2>
        """
        
        # Add insights content
        for insight in insights:
            html_content += f"""
                <div class="insight-card">
                    <h3>📊 Market Overview</h3>
                    <p><strong>Sentiment:</strong> {insight.get('market_overview', {}).get('sentiment', 'N/A')}</p>
                    <p><strong>Key Events:</strong> {insight.get('market_overview', {}).get('key_events', 'N/A')}</p>
                    
                    <h3>💡 Recommendations</h3>
            """
            
            if 'recommendations' in insight:
                for rec in insight['recommendations']:
                    html_content += f"""
                        <div class="recommendation">
                            <strong>{rec.get('symbol', 'N/A')}</strong> - {rec.get('action', 'N/A')}<br>
                            <small>Price: {rec.get('current_price', 'N/A')} | Target: {rec.get('target_price', 'N/A')}</small>
                        </div>
                    """
            
            if 'alerts' in insight:
                html_content += "<h3>⚠️ Alerts</h3>"
                for alert in insight['alerts']:
                    html_content += f"""
                        <div class="alert">
                            <strong>{alert.get('title', 'N/A')}</strong><br>
                            {alert.get('description', 'N/A')}
                        </div>
                    """
            
            html_content += "</div>"
        
        html_content += """
            </div>
        </body>
        </html>
        """
        
        # Create plain text version
        text_content = f"""
Investment Assistant Update - {time_of_day}
{datetime.now().strftime('%Y-%m-%d %H:%M')}

CHANGES DETECTED:
{chr(10).join([f'• {change}' for change in changes])}

LATEST INSIGHTS:
"""
        
        for insight in insights:
            text_content += f"""
Market Overview:
- Sentiment: {insight.get('market_overview', {}).get('sentiment', 'N/A')}
- Key Events: {insight.get('market_overview', {}).get('key_events', 'N/A')}

Recommendations:
"""
            
            if 'recommendations' in insight:
                for rec in insight['recommendations']:
                    text_content += f"- {rec.get('symbol', 'N/A')}: {rec.get('action', 'N/A')} (Price: {rec.get('current_price', 'N/A')}, Target: {rec.get('target_price', 'N/A')})\n"
            
            if 'alerts' in insight:
                text_content += "\nAlerts:\n"
                for alert in insight['alerts']:
                    text_content += f"- {alert.get('title', 'N/A')}: {alert.get('description', 'N/A')}\n"
        
        return subject, html_content, text_content
    
    def send_intelligent_update(self, time_of_day: str) -> bool:
        """Send intelligent update email only if there are significant changes"""
        try:
            # Get current insights (last 6 hours for afternoon updates)
            hours_back = 6 if time_of_day in ["1:00 PM", "5:00 PM"] else 24
            current_insights = self.get_recent_insights(hours_back)
            
            if not current_insights:
                logger.info(f"No insights found for {time_of_day} update")
                return False
            
            # Get previous insights for comparison (last 12 hours)
            previous_insights = self.get_recent_insights(12)
            
            # Check for significant changes
            has_changes, changes = self.has_significant_changes(current_insights, previous_insights)
            
            if not has_changes:
                logger.info(f"No significant changes detected for {time_of_day} update - skipping email")
                return False
            
            # Create and send email
            subject, html_content, text_content = self.create_email_content(current_insights, changes, time_of_day)
            
            return self.send_gmail(subject, text_content, html_content if html_content is not None else "")
            
        except Exception as e:
            logger.error(f"Error in intelligent update for {time_of_day}: {e}")
            return False 