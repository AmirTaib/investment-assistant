# -*- coding: utf-8 -*-
"""
Configuration Service for Investment Assistant
Reads configuration from GCP Secret Manager and environment variables
"""

import os
import json
import logging
from typing import Dict, Optional
from google.cloud import secretmanager

logger = logging.getLogger(__name__)

class ConfigService:
    def __init__(self):
        self.project_id = os.getenv('PROJECT_ID', 'investment-advisor-bot-2025')
        self.secret_name = os.getenv('SECRET_NAME', 'investment-bot-service-secret-key')
        self._config_cache = {}
        
    def get_secret(self, secret_name: str) -> Optional[str]:
        """Get secret from GCP Secret Manager"""
        try:
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/{self.project_id}/secrets/{secret_name}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception as e:
            logger.warning(f"Failed to get secret {secret_name}: {e}")
            return None
    
    def get_config_secret(self) -> Optional[Dict]:
        """Get configuration from Secret Manager"""
        try:
            config_data = self.get_secret('investment-assistant-config')
            if config_data:
                return json.loads(config_data)
        except Exception as e:
            logger.warning(f"Failed to parse config secret: {e}")
        return None
    
    def get_config(self) -> Dict:
        """Get complete configuration with fallbacks"""
        if self._config_cache:
            return self._config_cache
        
        # Try to get config from Secret Manager first
        config_secret = self.get_config_secret()
        
        config = {
            # GCP Configuration
            'PROJECT_ID': config_secret.get('PROJECT_ID') if config_secret else os.getenv('PROJECT_ID', 'investment-advisor-bot-2025'),
            'SECRET_NAME': config_secret.get('SECRET_NAME') if config_secret else os.getenv('SECRET_NAME', 'investment-bot-service-secret-key'),
            
            # Email Configuration
            'RECIPIENT_EMAIL': config_secret.get('RECIPIENT_EMAIL') if config_secret else os.getenv('RECIPIENT_EMAIL', 'amirtaib@gmail.com'),
            'EMAIL_PROVIDER': config_secret.get('EMAIL_PROVIDER') if config_secret else os.getenv('EMAIL_PROVIDER', 'gmail'),
            
            # Google Sheets Configuration
            'SHEET_ID': config_secret.get('SHEET_ID') if config_secret else os.getenv('SHEET_ID'),
            'SHEET_NAME': config_secret.get('SHEET_NAME') if config_secret else os.getenv('SHEET_NAME', 'Investment Dashboard'),
            
            # Firebase Configuration
            'FIRESTORE_COLLECTION': config_secret.get('FIRESTORE_COLLECTION') if config_secret else os.getenv('FIRESTORE_COLLECTION', 'investment_data'),
            'FIRESTORE_DOCUMENT': config_secret.get('FIRESTORE_DOCUMENT') if config_secret else os.getenv('FIRESTORE_DOCUMENT', 'portfolio'),
            
            # Application Configuration
            'FLASK_ENV': config_secret.get('FLASK_ENV') if config_secret else os.getenv('FLASK_ENV', 'production'),
            'LOG_LEVEL': config_secret.get('LOG_LEVEL') if config_secret else os.getenv('LOG_LEVEL', 'INFO'),
            'TIMEZONE': config_secret.get('TIMEZONE') if config_secret else os.getenv('TIMEZONE', 'Asia/Jerusalem'),
            
            # Investment Configuration
            'INITIAL_INVESTMENT': int(config_secret.get('INITIAL_INVESTMENT', '30000')) if config_secret else int(os.getenv('INITIAL_INVESTMENT', '30000')),
            'MONTHLY_INVESTMENT': int(config_secret.get('MONTHLY_INVESTMENT', '2000')) if config_secret else int(os.getenv('MONTHLY_INVESTMENT', '2000')),
            'CURRENCY': config_secret.get('CURRENCY') if config_secret else os.getenv('CURRENCY', 'ILS'),
            'RISK_LEVEL': config_secret.get('RISK_LEVEL') if config_secret else os.getenv('RISK_LEVEL', 'HIGH'),
            
            # Market Data Configuration
            'MARKET_DATA_PROVIDER': config_secret.get('MARKET_DATA_PROVIDER') if config_secret else os.getenv('MARKET_DATA_PROVIDER', 'yfinance'),
            'UPDATE_FREQUENCY': config_secret.get('UPDATE_FREQUENCY') if config_secret else os.getenv('UPDATE_FREQUENCY', 'daily'),
            'SCHEDULE_TIME': config_secret.get('SCHEDULE_TIME') if config_secret else os.getenv('SCHEDULE_TIME', '08:30'),
            
            # Email Configuration for Afternoon Updates
            'AFTERNOON_UPDATE_1PM': config_secret.get('AFTERNOON_UPDATE_1PM', 'true') if config_secret else os.getenv('AFTERNOON_UPDATE_1PM', 'true'),
            'AFTERNOON_UPDATE_5PM': config_secret.get('AFTERNOON_UPDATE_5PM', 'true') if config_secret else os.getenv('AFTERNOON_UPDATE_5PM', 'true'),
            'EMAIL_SIGNIFICANT_CHANGES_ONLY': config_secret.get('EMAIL_SIGNIFICANT_CHANGES_ONLY', 'true') if config_secret else os.getenv('EMAIL_SIGNIFICANT_CHANGES_ONLY', 'true'),
            
            # OpenAI Configuration
            'OPENAI_API_KEY': config_secret.get('OPENAI_API_KEY') if config_secret else os.getenv('OPENAI_API_KEY'),
            
            # Development Configuration
            'DEBUG': config_secret.get('DEBUG', 'false') if config_secret else os.getenv('DEBUG', 'false'),
            'LOCAL_TESTING': config_secret.get('LOCAL_TESTING', 'false') if config_secret else os.getenv('LOCAL_TESTING', 'false'),
        }
        
        # Convert string booleans to actual booleans
        for key in ['AFTERNOON_UPDATE_1PM', 'AFTERNOON_UPDATE_5PM', 'EMAIL_SIGNIFICANT_CHANGES_ONLY', 'DEBUG', 'LOCAL_TESTING']:
            if isinstance(config[key], str):
                config[key] = config[key].lower() == 'true'
        
        self._config_cache = config
        return config
    
    def get(self, key: str, default=None):
        """Get a specific configuration value"""
        config = self.get_config()
        return config.get(key, default)
    
    def set_config_secret(self, config_data: Dict) -> bool:
        """Set configuration in Secret Manager"""
        try:
            client = secretmanager.SecretManagerServiceClient()
            
            # Create secret if it doesn't exist
            try:
                secret_path = f"projects/{self.project_id}/secrets/investment-assistant-config"
                client.get_secret(request={"name": secret_path})
            except Exception:
                # Secret doesn't exist, create it
                parent = f"projects/{self.project_id}"
                secret_id = "investment-assistant-config"
                secret = client.create_secret(
                    request={
                        "parent": parent,
                        "secret_id": secret_id,
                        "secret": {"replication": {"automatic": {}}}
                    }
                )
            
            # Add new version
            secret_path = f"projects/{self.project_id}/secrets/investment-assistant-config"
            client.add_secret_version(
                request={
                    "parent": secret_path,
                    "payload": {"data": json.dumps(config_data).encode("UTF-8")}
                }
            )
            
            # Clear cache
            self._config_cache = {}
            
            logger.info("Configuration updated in Secret Manager")
            return True
            
        except Exception as e:
            logger.error(f"Failed to set config secret: {e}")
            return False
    
    def validate_config(self) -> Dict:
        """Validate configuration and return any issues"""
        config = self.get_config()
        issues = []
        
        # Required fields
        required_fields = [
            'PROJECT_ID',
            'RECIPIENT_EMAIL',
            'OPENAI_API_KEY'
        ]
        
        for field in required_fields:
            if not config.get(field):
                issues.append(f"Missing required field: {field}")
        
        # Validate email format
        email = config.get('RECIPIENT_EMAIL')
        if email and '@' not in email:
            issues.append("Invalid email format")
        
        # Validate numeric fields
        numeric_fields = ['INITIAL_INVESTMENT', 'MONTHLY_INVESTMENT']
        for field in numeric_fields:
            value = config.get(field)
            if value and not isinstance(value, (int, float)):
                try:
                    int(value)
                except ValueError:
                    issues.append(f"Invalid numeric value for {field}")
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'config': config
        }

# Global config service instance
config_service = ConfigService() 