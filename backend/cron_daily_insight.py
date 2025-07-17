#!/usr/bin/env python3
"""
Daily Insight Cron Job
This script is designed to be called by Google Cloud Scheduler
to generate daily investment insights at 8:00 AM Israel time.
"""

import os
import sys
import logging
from datetime import datetime
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def trigger_daily_insight():
    """Trigger the daily insight generation via HTTP request"""
    try:
        # Get the service URL from environment or use default
        service_url = os.getenv('SERVICE_URL', 'https://investment-assistant-cp6yzmvf2q-uc.a.run.app')
        
        # Make request to the daily insight endpoint
        response = requests.get(f"{service_url}/api/insights/daily", timeout=30)
        
        if response.status_code == 200:
            logger.info("Daily insight generated successfully")
            return True
        else:
            logger.error(f"Failed to generate daily insight. Status: {response.status_code}")
            return False
            
    except Exception as e:
        logger.error(f"Error triggering daily insight: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Starting daily insight generation...")
    success = trigger_daily_insight()
    
    if success:
        logger.info("Daily insight generation completed successfully")
        sys.exit(0)
    else:
        logger.error("Daily insight generation failed")
        sys.exit(1) 