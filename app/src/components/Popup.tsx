import React, { useEffect } from 'react';

// Apple-like design constants
const appleColors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
  },
  border: {
    light: '#C6C6C8',
    medium: '#8E8E93',
  },
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const appleSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

const appleBorderRadius = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'info',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return appleColors.success;
      case 'warning':
        return appleColors.warning;
      case 'danger':
        return appleColors.danger;
      default:
        return appleColors.primary;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { maxWidth: '400px', width: '90vw' };
      case 'lg':
        return { maxWidth: '800px', width: '90vw' };
      case 'xl':
        return { maxWidth: '1200px', width: '95vw' };
      default:
        return { maxWidth: '600px', width: '90vw' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: appleColors.overlay,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: appleSpacing.md,
      direction: 'rtl',
    }}
    onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        style={{
          backgroundColor: appleColors.background.primary,
          borderRadius: appleBorderRadius['2xl'],
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'popupSlideIn 0.3s ease-out',
          ...getSizeStyles(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: appleSpacing.xl,
          borderBottom: `1px solid ${appleColors.border.light}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: appleColors.background.secondary,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: appleSpacing.md,
          }}>
            <span style={{ fontSize: '24px' }}>
              {getTypeIcon()}
            </span>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: appleColors.text.primary,
              margin: 0,
            }}>
              {title}
            </h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: appleColors.text.tertiary,
                padding: appleSpacing.sm,
                borderRadius: appleBorderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                width: '32px',
                height: '32px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = appleColors.background.tertiary;
                e.currentTarget.style.color = appleColors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = appleColors.text.tertiary;
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: appleSpacing.xl,
          maxHeight: '70vh',
          overflowY: 'auto',
        }}>
          {children}
        </div>

        {/* Optional Footer */}
        <div style={{
          padding: appleSpacing.xl,
          borderTop: `1px solid ${appleColors.border.light}`,
          backgroundColor: appleColors.background.secondary,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: appleSpacing.md,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: `${appleSpacing.sm} ${appleSpacing.lg}`,
              border: `1px solid ${appleColors.border.light}`,
              borderRadius: appleBorderRadius.lg,
              backgroundColor: appleColors.background.primary,
              color: appleColors.text.primary,
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = appleColors.background.tertiary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = appleColors.background.primary;
            }}
          >
            סגור
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Specialized popup components
export const AlertPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
}> = ({ isOpen, onClose, title, message, type = 'info' }) => (
  <Popup
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    type={type}
    size="sm"
  >
    <div style={{
      fontSize: '16px',
      lineHeight: 1.6,
      color: appleColors.text.primary,
      textAlign: 'center',
    }}>
      {message}
    </div>
  </Popup>
);

export const ConfirmPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'אישור',
  cancelText = 'ביטול',
  type = 'warning'
}) => (
  <Popup
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    type={type}
    size="sm"
    showCloseButton={false}
    closeOnOverlayClick={false}
  >
    <div style={{
      fontSize: '16px',
      lineHeight: 1.6,
      color: appleColors.text.primary,
      textAlign: 'center',
      marginBottom: appleSpacing.xl,
    }}>
      {message}
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: appleSpacing.md,
    }}>
      <button
        onClick={onClose}
        style={{
          padding: `${appleSpacing.sm} ${appleSpacing.lg}`,
          border: `1px solid ${appleColors.border.light}`,
          borderRadius: appleBorderRadius.lg,
          backgroundColor: appleColors.background.primary,
          color: appleColors.text.primary,
          fontSize: '16px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = appleColors.background.tertiary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = appleColors.background.primary;
        }}
      >
        {cancelText}
      </button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        style={{
          padding: `${appleSpacing.sm} ${appleSpacing.lg}`,
          border: 'none',
          borderRadius: appleBorderRadius.lg,
          backgroundColor: getTypeColor(type),
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {confirmText}
      </button>
    </div>
  </Popup>
);

// Helper function to get type color
const getTypeColor = (type: string) => {
  switch (type) {
    case 'success':
      return appleColors.success;
    case 'warning':
      return appleColors.warning;
    case 'danger':
      return appleColors.danger;
    default:
      return appleColors.primary;
  }
}; 