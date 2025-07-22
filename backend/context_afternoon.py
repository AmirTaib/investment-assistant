# -*- coding: utf-8 -*-
"""
Afternoon Update Context for Investment Assistant
Specialized prompts for 1:00 PM and 5:00 PM updates focusing on changes and important developments
"""

import os
from datetime import datetime, timedelta
from typing import Dict, List

def get_afternoon_prompt(time_of_day: str = "1:00 PM") -> str:
    """
    Generate specialized prompt for afternoon updates
    Focuses on changes since morning and important developments
    """
    
    # Determine market context based on time
    if time_of_day == "1:00 PM":
        market_context = "🕐 MIDDAY UPDATE (1:00 PM Israel Time) - Focus on changes since morning and intraday opportunities."
    else:  # 5:00 PM
        market_context = "🕔 END-OF-DAY UPDATE (5:00 PM Israel Time) - Focus on today's summary and tomorrow's preparation."
    
    base_prompt = f"""
    {market_context}
    
    You are an investment advisor providing a targeted update. Only include information if there are SIGNIFICANT CHANGES or IMPORTANT DEVELOPMENTS.
    
    CRITERIA FOR INCLUDING INFORMATION:
    • New stock recommendations
    • Significant price movements (>3%)
    • Changes in market sentiment
    • New high-priority alerts
    • Important news events
    
    If no significant changes occurred, indicate this clearly.
    
    Return ONLY valid JSON with this structure:
    {{
        "market_overview": {{
            "sentiment": "bullish|bearish|neutral",
            "key_events": "תיאור קצר של אירועים חשובים",
            "changes_since_morning": "מה השתנה מאז עדכון הבוקר"
        }},
        "recommendations": [
            {{
                "symbol": "סמל_מניה",
                "action": "buy|sell|hold",
                "current_price": "מחיר נוכחי",
                "target_price": "מחיר יעד",
                "reason": "למה המלצה זו השתנתה או חדשה"
            }}
        ],
        "alerts": [
            {{
                "title": "כותרת התראה",
                "description": "תיאור מפורט",
                "priority": "high|medium|low"
            }}
        ],
        "update_summary": {{
            "has_significant_changes": true|false,
            "change_count": 0,
            "priority_level": "high|medium|low"
        }}
    }}
    
    IMPORTANT: If no significant changes, set "has_significant_changes": false and keep other fields minimal.
    ALL TEXT IN THE RESPONSE MUST BE IN HEBREW.
    """
    
    return base_prompt

def get_market_data_context() -> str:
    """Get current market data context for afternoon updates"""
    return """
    📊 CURRENT MARKET DATA CONTEXT:
    
    Israeli Market Focus:
    • Tel Aviv 125 Index performance
    • Major Israeli stocks movement
    • Shekel/Dollar exchange rate
    • Israeli economic news and events
    
    Global Market Context:
    • US market futures (for 5:00 PM updates)
    • European market performance
    • Oil prices and commodities
    • Global economic indicators
    
    Sector Watch:
    • Technology sector performance
    • Financial sector developments
    • Real estate market updates
    • Healthcare and biotech news
    """

def get_risk_assessment_prompt() -> str:
    """Get risk assessment prompt for afternoon updates"""
    return """
    ⚠️ RISK ASSESSMENT FOR AFTERNOON UPDATE:
    
    Evaluate current risk levels and provide warnings for:
    
    1. Market Risks:
       • Volatility spikes
       • Liquidity concerns
       • Sector-specific risks
    
    2. Portfolio Risks:
       • Concentration risks
       • Currency exposure
       • Over-exposure to sectors
    
    3. External Risks:
       • Geopolitical events
       • Economic policy changes
       • Regulatory developments
    
    Only include risks that are NEW or have changed significantly since the morning update.
    """

def get_afternoon_update_summary(insights: List[Dict]) -> str:
    """Generate a summary of afternoon update findings"""
    if not insights:
        return "לא זוהו שינויים משמעותיים במושב הצהריים."
    
    summary = f"סיכום עדכון צהריים ({datetime.now().strftime('%H:%M')}):\n\n"
    
    for insight in insights:
        if 'update_summary' in insight:
            summary_data = insight['update_summary']
            if summary_data.get('has_significant_changes', False):
                summary += f"✅ זוהו {summary_data.get('change_count', 0)} שינויים משמעותיים\n"
                summary += f"רמת עדיפות: {summary_data.get('priority_level', 'medium')}\n"
            else:
                summary += "ℹ️ לא זוהו שינויים משמעותיים - עדכון דולג\n"
    
    return summary 