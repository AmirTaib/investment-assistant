import React from 'react';
import { theme } from '../styles/theme';

// Apple-like design system
const appleTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    // Apple-inspired colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#007AFF', // Apple blue
      600: '#0056CC',
      700: '#003D99',
      800: '#002A66',
      900: '#001A33',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#34C759', // Apple green
      600: '#28A745',
      700: '#1E7E34',
      800: '#155724',
      900: '#0F3D1A',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#FF9500', // Apple orange
      600: '#E6850E',
      700: '#B36B0B',
      800: '#805108',
      900: '#4D3105',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#FF3B30', // Apple red
      600: '#E63946',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7', // Apple system gray 6
      tertiary: '#E5E5EA', // Apple system gray 5
      card: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#000000',
      secondary: '#3C3C43', // Apple system gray
      tertiary: '#8E8E93', // Apple system gray 2
      inverse: '#FFFFFF',
      muted: '#C7C7CC', // Apple system gray 3
    },
    border: {
      light: '#C6C6C8', // Apple system gray 4
      medium: '#8E8E93',
      dark: '#3C3C43',
    },
  },
  spacing: {
    ...theme.spacing,
    // Apple-like spacing
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    ...theme.borderRadius,
    // Apple-like border radius
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },
  shadows: {
    ...theme.shadows,
    // Apple-like shadows
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.1)',
  },
};

// Container Components
export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: appleTheme.colors.background.secondary,
    fontFamily: appleTheme.typography.fontFamily.primary,
    direction: 'rtl',
    padding: '0',
    margin: '0',
  }}>
    {children}
  </div>
);

export const ContentContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: appleTheme.spacing.md,
  }}>
    {children}
  </div>
);

// Header Components
export const PageHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <header style={{
    textAlign: 'center',
    marginBottom: appleTheme.spacing['2xl'],
    padding: appleTheme.spacing.xl,
    backgroundColor: appleTheme.colors.background.primary,
    borderRadius: appleTheme.borderRadius['2xl'],
    boxShadow: appleTheme.shadows.sm,
    border: `1px solid ${appleTheme.colors.border.light}`,
  }}>
    {children}
  </header>
);

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 style={{
    fontSize: appleTheme.typography.fontSize['4xl'],
    fontWeight: appleTheme.typography.fontWeight.bold,
    color: appleTheme.colors.text.primary,
    marginBottom: appleTheme.spacing.lg,
    background: `linear-gradient(135deg, ${appleTheme.colors.primary[500]}, ${appleTheme.colors.success[500]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }}>
    {children}
  </h1>
);

export const StatusBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: appleTheme.typography.fontSize.lg,
    color: appleTheme.colors.text.secondary,
    padding: appleTheme.spacing.md,
    backgroundColor: appleTheme.colors.success[50],
    borderRadius: appleTheme.borderRadius.lg,
    border: `1px solid ${appleTheme.colors.success[200]}`,
    fontWeight: appleTheme.typography.fontWeight.medium,
  }}>
    {children}
  </div>
);

// Loading Components
export const LoadingContainer: React.FC = () => (
  <div style={{
    padding: appleTheme.spacing['3xl'],
    textAlign: 'center',
    direction: 'rtl',
    fontFamily: appleTheme.typography.fontFamily.primary,
    fontSize: appleTheme.typography.fontSize.lg,
    backgroundColor: appleTheme.colors.background.secondary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <div style={{
      fontSize: appleTheme.typography.fontSize['3xl'],
      marginBottom: appleTheme.spacing.xl,
      color: appleTheme.colors.text.primary,
      fontWeight: appleTheme.typography.fontWeight.bold,
    }}>
      טוען תובנות...
    </div>
    <div style={{
      fontSize: appleTheme.typography.fontSize.base,
      color: appleTheme.colors.text.secondary,
      maxWidth: '400px',
      marginBottom: appleTheme.spacing.xl,
    }}>
      עדכונים בזמן אמת מופעלים - תובנות חדשות יופיעו אוטומטית
    </div>
    <div style={{
      width: '40px',
      height: '40px',
      border: `3px solid ${appleTheme.colors.primary[200]}`,
      borderTop: `3px solid ${appleTheme.colors.primary[500]}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Error Components
export const ErrorContainer: React.FC<{ error: string }> = ({ error }) => (
  <div style={{
    padding: appleTheme.spacing['3xl'],
    color: appleTheme.colors.danger[500],
    direction: 'rtl',
    fontFamily: appleTheme.typography.fontFamily.primary,
    fontSize: appleTheme.typography.fontSize.lg,
    textAlign: 'center',
    backgroundColor: appleTheme.colors.background.secondary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <div style={{
      fontSize: appleTheme.typography.fontSize['3xl'],
      marginBottom: appleTheme.spacing.xl,
      fontWeight: appleTheme.typography.fontWeight.bold,
    }}>
      שגיאה: {error}
    </div>
    <div style={{
      fontSize: appleTheme.typography.fontSize.base,
      marginTop: appleTheme.spacing.xl,
      color: appleTheme.colors.text.secondary,
    }}>
      נסה לרענן את הדף או בדוק את החיבור שלך
    </div>
  </div>
);

// Empty State Components
export const EmptyStateContainer: React.FC = () => (
  <div style={{
    textAlign: 'center',
    padding: appleTheme.spacing['3xl'],
    color: appleTheme.colors.text.secondary,
    backgroundColor: appleTheme.colors.background.primary,
    borderRadius: appleTheme.borderRadius['2xl'],
    border: `2px dashed ${appleTheme.colors.border.medium}`,
    direction: 'rtl',
    fontFamily: appleTheme.typography.fontFamily.primary,
  }}>
    <div style={{
      fontSize: appleTheme.typography.fontSize['3xl'],
      marginBottom: appleTheme.spacing.xl,
      color: appleTheme.colors.text.primary,
      fontWeight: appleTheme.typography.fontWeight.bold,
    }}>
      אין תובנות זמינות עדיין
    </div>
    <div style={{
      fontSize: appleTheme.typography.fontSize.lg,
      marginTop: appleTheme.spacing.xl,
    }}>
      תובנות יופיעו כאן כאשר הן ייווצרו
    </div>
  </div>
);

// Insight Card Components
export const InsightCard: React.FC<{ 
  children: React.ReactNode; 
  isLatest?: boolean; 
  index: number;
}> = ({ children, isLatest = false, index }) => (
  <article style={{
    padding: appleTheme.spacing.xl,
    backgroundColor: isLatest ? appleTheme.colors.warning[50] : appleTheme.colors.background.primary,
    border: isLatest 
      ? `2px solid ${appleTheme.colors.warning[500]}` 
      : `1px solid ${appleTheme.colors.border.light}`,
    borderRadius: appleTheme.borderRadius['2xl'],
    boxShadow: isLatest 
      ? appleTheme.shadows.lg 
      : appleTheme.shadows.sm,
    direction: 'rtl',
    fontFamily: appleTheme.typography.fontFamily.primary,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: appleTheme.spacing.lg,
  }}>
    {children}
  </article>
);

export const NewBadge: React.FC = () => (
  <div style={{
    position: 'absolute',
    top: appleTheme.spacing.md,
    left: appleTheme.spacing.md,
    backgroundColor: appleTheme.colors.warning[500],
    color: appleTheme.colors.text.inverse,
    padding: `${appleTheme.spacing.xs} ${appleTheme.spacing.sm}`,
    borderRadius: appleTheme.borderRadius.full,
    fontSize: appleTheme.typography.fontSize.xs,
    fontWeight: appleTheme.typography.fontWeight.bold,
    textTransform: 'uppercase',
    zIndex: 1,
  }}>
    חדש
  </div>
);

export const InsightHeader: React.FC<{ 
  children: React.ReactNode; 
  isLatest?: boolean;
}> = ({ children, isLatest = false }) => (
  <header style={{
    marginBottom: appleTheme.spacing.xl,
    textAlign: 'center',
    paddingTop: isLatest ? appleTheme.spacing.lg : 0,
  }}>
    {children}
  </header>
);

export const InsightMeta: React.FC<{ 
  timestamp: string; 
  currency: string; 
  source: string;
}> = ({ timestamp, currency, source }) => (
  <div style={{
    fontSize: appleTheme.typography.fontSize.sm,
    color: appleTheme.colors.text.secondary,
    marginBottom: appleTheme.spacing.md,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: appleTheme.spacing.sm,
  }}>
    <span style={{ fontWeight: appleTheme.typography.fontWeight.medium }}>
      {timestamp}
    </span>
    <span style={{
      backgroundColor: appleTheme.colors.primary[100],
      color: appleTheme.colors.primary[700],
      padding: `${appleTheme.spacing.xs} ${appleTheme.spacing.sm}`,
      borderRadius: appleTheme.borderRadius.full,
      fontSize: appleTheme.typography.fontSize.xs,
      fontWeight: appleTheme.typography.fontWeight.medium,
    }}>
      {currency} | {source}
    </span>
  </div>
);

export const InsightTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 style={{
    fontSize: appleTheme.typography.fontSize['3xl'],
    marginBottom: appleTheme.spacing.xl,
    color: appleTheme.colors.text.primary,
    fontWeight: appleTheme.typography.fontWeight.bold,
    lineHeight: appleTheme.typography.lineHeight.tight,
  }}>
    {children}
  </h2>
);

// Section Components
export const SectionHeader: React.FC<{ 
  children: React.ReactNode; 
  color: string;
}> = ({ children, color }) => (
  <h3 style={{
    fontSize: appleTheme.typography.fontSize['2xl'],
    marginBottom: appleTheme.spacing.xl,
    color: appleTheme.colors.text.primary,
    fontWeight: appleTheme.typography.fontWeight.bold,
    textAlign: 'center',
    borderBottom: `2px solid ${color}`,
    paddingBottom: appleTheme.spacing.md,
  }}>
    {children}
  </h3>
);

export const SectionContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section style={{ 
    marginBottom: appleTheme.spacing.xl,
  }}>
    {children}
  </section>
);

export const SectionGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ 
    display: 'grid', 
    gap: appleTheme.spacing.lg,
  }}>
    {children}
  </div>
);

// Stats Component
export const StatsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: appleTheme.typography.fontSize.lg,
    color: appleTheme.colors.text.primary,
    marginBottom: appleTheme.spacing.xl,
    fontWeight: appleTheme.typography.fontWeight.medium,
    textAlign: 'center',
    padding: appleTheme.spacing.md,
    backgroundColor: appleTheme.colors.background.primary,
    borderRadius: appleTheme.borderRadius.lg,
    boxShadow: appleTheme.shadows.sm,
  }}>
    {children}
  </div>
); 