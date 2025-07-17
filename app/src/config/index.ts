// Export all configuration modules
export { firebaseConfig, config } from './firebase';
export { environment, getCurrentEnvironment, currentEnv } from './environment';
export { 
  APP_CONSTANTS, 
  API_ENDPOINTS, 
  FIRESTORE_COLLECTIONS, 
  UI_CONSTANTS 
} from './constants';

// Default export for convenience
export { default as constants } from './constants';
export { default as firebaseConfigDefault } from './firebase'; 