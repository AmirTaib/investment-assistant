// Application constants
export const APP_CONSTANTS = {
  APP_NAME: 'Investment Assistant',
  VERSION: '1.0.0',
  INSIGHTS_LIMIT: 20,
  REFRESH_INTERVAL: 30000, // 30 seconds
  ERROR_MESSAGES: {
    LOADING_FAILED: 'Failed to load insights',
    NETWORK_ERROR: 'Network error occurred',
    FIREBASE_ERROR: 'Firebase connection error'
  },
  SUCCESS_MESSAGES: {
    INSIGHTS_LOADED: 'Insights loaded successfully',
    REAL_TIME_ENABLED: 'Real-time updates enabled'
  }
};

// API endpoints
export const API_ENDPOINTS = {
  DAILY_INSIGHTS: '/api/insights/daily',
  RECENT_INSIGHTS: '/api/insights/recent',
  PORTFOLIO_SUMMARY: '/api/portfolio/summary',
  RISK_ASSESSMENT: '/api/portfolio/risk',
  WEEKLY_REPORT: '/api/reports/weekly',
  STOCK_INFO: '/api/stocks',
  HEALTH: '/health'
};

// Firebase collections
export const FIRESTORE_COLLECTIONS = {
  DAILY_INSIGHTS: 'daily_insights',
  PORTFOLIO_DATA: 'portfolio_data',
  USER_PREFERENCES: 'user_preferences'
};

// UI constants
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#007bff',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    DANGER: '#dc3545',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40'
  },
  SPACING: {
    SMALL: '10px',
    MEDIUM: '20px',
    LARGE: '40px'
  },
  BORDER_RADIUS: '5px',
  SHADOW: '0 2px 4px rgba(0,0,0,0.1)'
};

export default {
  APP_CONSTANTS,
  API_ENDPOINTS,
  FIRESTORE_COLLECTIONS,
  UI_CONSTANTS
}; 