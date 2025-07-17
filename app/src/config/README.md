# Configuration Structure

This directory contains all configuration files for the Investment Assistant React application, following React.js best practices.

## Files

### `firebase.ts`
Contains Firebase configuration and main application config object.
- `firebaseConfig`: Firebase SDK configuration
- `config`: Main application configuration object

### `environment.ts`
Environment-specific configurations for development and production.
- `environment`: Object containing configs for different environments
- `getCurrentEnvironment()`: Function to get current environment config
- `currentEnv`: Current environment configuration

### `constants.ts`
Application constants and configuration values.
- `APP_CONSTANTS`: Application-level constants
- `API_ENDPOINTS`: API endpoint definitions
- `FIRESTORE_COLLECTIONS`: Firestore collection names
- `UI_CONSTANTS`: UI-related constants (colors, spacing, etc.)

### `index.ts`
Main export file that consolidates all configuration exports.

## Usage

### Basic Import
```typescript
import { firebaseConfig, APP_CONSTANTS, API_ENDPOINTS } from './config';
```

### Environment-Specific Config
```typescript
import { currentEnv } from './config';

// Use environment-specific API base URL
const apiUrl = currentEnv.apiBaseUrl;
```

### Constants Usage
```typescript
import { FIRESTORE_COLLECTIONS, UI_CONSTANTS } from './config';

// Use collection name
const collectionRef = collection(db, FIRESTORE_COLLECTIONS.DAILY_INSIGHTS);

// Use UI constants
const buttonStyle = {
  backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
  borderRadius: UI_CONSTANTS.BORDER_RADIUS
};
```

## Environment Variables

The application supports the following environment variables:
- `NODE_ENV`: Set to 'development' or 'production'
- `REACT_APP_API_BASE_URL`: Override API base URL

## Adding New Configuration

1. Add new constants to `constants.ts`
2. Add environment-specific values to `environment.ts`
3. Export from `index.ts`
4. Import and use in components

## Best Practices

- Always use constants instead of hardcoded values
- Use environment-specific configurations for different deployment environments
- Keep sensitive information in environment variables
- Use TypeScript for type safety
- Document any new configuration options 