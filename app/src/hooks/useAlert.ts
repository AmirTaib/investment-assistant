import { useState, useCallback } from 'react';

export interface AlertConfig {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  duration?: number; // Auto-close after duration (ms), 0 = no auto-close
}

export interface AlertState extends AlertConfig {
  isOpen: boolean;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlert({
      ...config,
      isOpen: true,
    });

    // Auto-close if duration is specified
    if (config.duration && config.duration > 0) {
      setTimeout(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
      }, config.duration);
    }
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    showAlert({ title, message, type: 'success', duration });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    showAlert({ title, message, type: 'warning', duration });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    showAlert({ title, message, type: 'danger', duration });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    showAlert({ title, message, type: 'info', duration });
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showWarning,
    showError,
    showInfo,
  };
}; 