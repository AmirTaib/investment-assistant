# -*- coding: utf-8 -*-
"""
Investment Assistant - Enhanced Context for Actionable Insights
This file generates more visual, actionable, and user-friendly investment insights.
"""

from datetime import datetime

def get_investor_profile():
    return (
        "INVESTOR PROFILE:\n"
        "- Initial capital: 30,000 ILS\n"
        "- Monthly investment: 2,000 ILS\n"
        "- Platform: Kablani Trade (Phoenix)\n"
        "- Strategy: Aggressive growth with calculated risk\n"
        "- Risk tolerance: HIGH (backed by pension funds and other conservative investments)\n"
        "- Goal: Beat the market significantly, not just match it\n"
    )

def get_portfolio_strategy():
    return (
        "PORTFOLIO STRATEGY:\n"
        "- 70% long-term: S&P 500 (25%), QQQ (25%), growth stocks (20%)\n"
        "- 30% short-term: momentum stocks (15%), leveraged ETFs (10%), crypto (5%)\n"
        "- Focus on market-beating opportunities, not generic recommendations\n"
    )

def get_investment_philosophy():
    return (
        "INVESTMENT PHILOSOPHY:\n"
        "- Look for breakout opportunities before mainstream media catches on\n"
        "- Focus on volume spikes, unusual options activity, and hidden accumulation\n"
        "- Combine technical analysis with fundamental catalysts\n"
        "- Include leveraged ETFs (TQQQ, SOXL) for aggressive positions\n"
        "- Consider contrarian plays when markets are overcrowded\n"
        "- Always provide specific amounts and allocation percentages\n"
    )

def get_full_context():
    return (
        "You are a professional investment advisor for an Israeli investor with the following profile:\n\n"
        + get_investor_profile() + "\n"
        + get_portfolio_strategy() + "\n"
        + get_investment_philosophy()
    )

def get_prompt(date=None):
    if date is None:
        date = datetime.now().strftime('%B %d, %Y')
    context = get_full_context()
    return f"""{context}

Generate a comprehensive daily investment insight for {date} with the following ENHANCED structure:

1. MARKET OVERVIEW (Market Review):
- What happened yesterday and what to expect today
- Important events you must know (not just information)
- Explanation of why it's important for you to know this
- How it affects your investments

2. SPECIFIC RECOMMENDATIONS (Investment Recommendations):
Provide exactly 5 HIGH-QUALITY, UNIQUE investment opportunities that are:
- Based on RARE opportunities that emerged TODAY due to specific events or changes
- Only recommend if you are 90%+ confident it will help make significant money
- Focus on UNIQUE situations, not generic market movements
- Based on FACTS only, no speculation
- Each recommendation should be actionable and specific

For each position provide:
- Action: Buy/Sell/Hold
- Amount to invest/exit (in ILS and portfolio percentages)
- Current value - Buy price - Stop - Sell target
- Detailed reasoning based on FACTS
- Timeframe
- Existing risks and why this recommendation is still valid
- Specific event or catalyst that created this opportunity

3. SECTOR ANALYSIS (Sector Analysis):
- What action is required based on the analysis
- What are the risks
- Why this recommendation is still valid
- How it affects your portfolio

4. ALERTS (Alerts):
- If it's an alert to sell immediately something you hold
- If it's an alert to buy immediately something you don't have
- What action is required and urgency
- How it differs from regular investment recommendations

5. RISK MANAGEMENT (Risk Management):
- Whether it's general portfolio risk management or for that day
- Friendly and simple explanation
- What you need to do now

Return the result as a valid JSON with the following ENHANCED structure:
{{
    "timestamp": "ISO timestamp",
    "title": "Daily Investment Insights - {date}",
    "date": "DD/MM/YYYY",
    "currency": "ILS",
    "market_overview": {{
        "summary": "Market summary - what happened and what's expected",
        "sentiment": "Positive/Negative/Neutral",
        "key_events": [
            {{
                "event": "Important event",
                "importance": "Why it's important for you to know this",
                "impact": "How it affects your investments"
            }}
        ],
        "trending_sectors": ["Sector 1", "Sector 2"],
        "action_items": ["Action 1 you need to take", "Action 2 you need to take"]
    }},
    "recommendations": [
        {{
            "symbol": "NVDA",
            "action": "Buy/Sell/Hold",
            "action_hebrew": "Detailed action in Hebrew",
            "amount_ils": "5000",
            "percentage_of_portfolio": "15%",
            "current_price": "750",
            "target_price": "850",
            "stop_loss": "700",
            "confidence": "High/Medium/Low",
            "reason": "Detailed reasoning based on FACTS why to buy/sell",
            "timeframe": "1-2 weeks / 3-6 months",
            "risks": "What are the risks",
            "why_despite_risks": "Why this recommendation is still valid",
            "type": "Short term/Long term",
            "catalyst": "Specific event or catalyst that created this opportunity"
        }}
    ],
    "sector_analysis": [
        {{
            "sector": "AI/Technology",
            "status": "Positive/Negative/Neutral",
            "recommendation": "Buy/Hold/Avoid",
            "action_required": "What action is required based on the analysis",
            "top_picks": ["Stock 1", "Stock 2"],
            "reason": "Why the sector is interesting",
            "risks": "What are the sector risks",
            "why_despite_risks": "Why to recommend despite risks",
            "portfolio_impact": "How it affects your portfolio"
        }}
    ],
    "alerts": [
        {{
            "type": "Earnings/News/Technical",
            "symbol": "NVDA",
            "message": "What the alert says",
            "priority": "High/Medium/Low",
            "action_required": "What action is required",
            "urgency": "Urgent/Medium/Not urgent",
            "immediate_action": "Sell immediately something you hold / Buy immediately something you don't have"
        }}
    ],
    "risk_management": {{
        "current_risk": "High/Medium/Low",
        "risk_type": "General portfolio risk management / For that day",
        "explanation": "Friendly and simple explanation",
        "immediate_actions": ["Action 1 you need to take now", "Action 2"],
        "stop_loss_levels": ["NVDA: 700", "TSLA: 110"],
        "hedging_strategies": ["Hedging strategy 1", "Hedging strategy 2"]
    }}
}}

CRITICAL REQUIREMENTS:
- Provide exactly 5 HIGH-QUALITY, UNIQUE investment recommendations
- Only recommend if you are 90%+ confident it will help make significant money
- Focus on RARE opportunities that emerged TODAY due to specific events
- Base ALL recommendations on FACTS only, no speculation or made-up data
- All values in the JSON should be in Hebrew (except JSON keys)
- Provide specific amounts in ILS for each recommendation
- Focus on market-beating opportunities, not generic advice
- Consider the investor's aggressive risk tolerance
- Include both technical and fundamental analysis
- Give clear and user-friendly explanations
- Focus on specific actions that can be taken
- Always explain why the recommendation is important and what the risks are
- Return only valid JSON without additional text
- Ensure all Hebrew text is properly encoded and doesn't break JSON structure
- Stop-loss levels must include stock symbol (e.g., "NVDA: 700")
- Each recommendation must have a specific catalyst or event that created the opportunity
""" 