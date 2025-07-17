import { currentEnv } from './environment';

// Firebase configuration from environment
export const firebaseConfig = currentEnv.firebase;

// Environment-specific configurations
export const config = {
  firebase: firebaseConfig,
  api: {
    baseUrl: currentEnv.apiBaseUrl,
    endpoints: {
      dailyInsights: '/api/insights/daily',
      recentInsights: '/api/insights/recent',
      portfolioSummary: '/api/portfolio/summary',
      riskAssessment: '/api/portfolio/risk',
      weeklyReport: '/api/reports/weekly'
    }
  },
  app: {
    name: 'Investment Assistant',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }
};

export default config; 