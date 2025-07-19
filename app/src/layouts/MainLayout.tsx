import React from 'react';
import { theme } from '../styles/theme';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background.secondary,
      fontFamily: theme.typography.fontFamily.primary,
      direction: 'rtl'
    }}>
      {/* Global Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: ${theme.typography.fontFamily.primary};
          background-color: ${theme.colors.background.secondary};
          direction: rtl;
        }
        
        /* Responsive Design */
        @media (max-width: ${theme.breakpoints.md}) {
          body {
            font-size: 14px;
          }
        }
        
        @media (max-width: ${theme.breakpoints.sm}) {
          body {
            font-size: 12px;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Focus styles for accessibility */
        *:focus {
          outline: 2px solid ${theme.colors.primary[500]};
          outline-offset: 2px;
        }
        
        /* Selection styles */
        ::selection {
          background-color: ${theme.colors.primary[200]};
          color: ${theme.colors.text.primary};
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${theme.colors.background.secondary};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${theme.colors.neutral[300]};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.neutral[400]};
        }
      `}</style>
      
      {/* Main Content */}
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>
    </div>
  );
}; 