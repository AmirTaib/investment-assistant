// Environment configuration
export const environment = {
  development: {
    apiBaseUrl: 'http://localhost:5000',
    firebase: {
      projectId: "investment-advisor-bot-2025",
      appId: "1:1084406986293:web:220a00d507aec87f03637c",
      storageBucket: "investment-advisor-bot-2025.firebasestorage.app",
      apiKey: "AIzaSyDvAVQDdV29YhBn2nb00VUh3L5NJe8geGU",
      authDomain: "investment-advisor-bot-2025.firebaseapp.com",
      messagingSenderId: "1084406986293",
      measurementId: "G-S0HJWFERZX"
    }
  },
  production: {
    apiBaseUrl: 'https://investment-assistant-cp6yzmvf2q-uc.a.run.app',
    firebase: {
      projectId: "investment-advisor-bot-2025",
      appId: "1:1084406986293:web:220a00d507aec87f03637c",
      storageBucket: "investment-advisor-bot-2025.firebasestorage.app",
      apiKey: "AIzaSyDvAVQDdV29YhBn2nb00VUh3L5NJe8geGU",
      authDomain: "investment-advisor-bot-2025.firebaseapp.com",
      messagingSenderId: "1084406986293",
      measurementId: "G-S0HJWFERZX"
    }
  }
};

// Get current environment
export const getCurrentEnvironment = () => {
  const env = process.env.NODE_ENV || 'development';
  return environment[env as keyof typeof environment] || environment.development;
};

// Export current environment config
export const currentEnv = getCurrentEnvironment(); 