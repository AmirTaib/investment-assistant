import React from 'react';
import { MarketOverview as MarketOverviewType } from '../types/insights';
import { getSentimentColor } from '../utils/formatters';

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

interface MarketOverviewProps {
  marketOverview: MarketOverviewType;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ marketOverview }) => {
  const sentimentColor = getSentimentColor(marketOverview.sentiment);
  
  const getSentimentBgColor = () => {
    switch (sentimentColor) {
      case 'success':
        return '#E8F5E8';
      case 'danger':
        return '#FFE8E8';
      case 'warning':
        return '#FFF8E8';
      default:
        return '#F2F2F7';
    }
  };

  const getSentimentBorderColor = () => {
    switch (sentimentColor) {
      case 'success':
        return appleColors.success;
      case 'danger':
        return appleColors.danger;
      case 'warning':
        return appleColors.warning;
      default:
        return appleColors.border.light;
    }
  };

  const getSentimentTextColor = () => {
    switch (sentimentColor) {
      case 'success':
        return '#28A745';
      case 'danger':
        return '#E63946';
      case 'warning':
        return '#E6850E';
      default:
        return appleColors.text.primary;
    }
  };

  return (
    <div style={{
      marginBottom: appleSpacing['2xl'],
      direction: 'rtl'
    }}>
      <h3 style={{
        fontSize: '28px',
        marginBottom: appleSpacing.xl,
        color: appleColors.text.primary,
        fontWeight: 700,
        textAlign: 'center',
        borderBottom: `2px solid ${appleColors.primary}`,
        paddingBottom: appleSpacing.md,
        position: 'relative'
      }}>
        📊 סקירת שוק
      </h3>
      
      <div style={{
        padding: appleSpacing.xl,
        backgroundColor: getSentimentBgColor(),
        borderRadius: appleBorderRadius['2xl'],
        fontSize: '18px',
        lineHeight: 1.6,
        border: `1px solid ${getSentimentBorderColor()}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sentiment Badge */}
        <div style={{
          position: 'absolute',
          top: appleSpacing.md,
          left: appleSpacing.md,
          backgroundColor: getSentimentBorderColor(),
          color: '#FFFFFF',
          padding: `${appleSpacing.xs} ${appleSpacing.sm}`,
          borderRadius: appleBorderRadius.full,
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {marketOverview.sentiment || 'לא מוגדר'}
        </div>

        <div style={{
          fontWeight: 700,
          marginBottom: appleSpacing.xl,
          fontSize: '20px',
          color: appleColors.text.primary,
          textAlign: 'center',
          marginTop: appleSpacing.md
        }}>
          {marketOverview.summary || 'אין סיכום'}
        </div>

        {/* Key Events */}
        {marketOverview.key_events?.length > 0 && (
          <div style={{
            marginBottom: appleSpacing.xl,
            backgroundColor: appleColors.background.primary,
            borderRadius: appleBorderRadius.lg,
            padding: appleSpacing.xl,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: appleSpacing.md,
              color: appleColors.text.primary
            }}>
              🎯 אירועים חשובים
            </h4>
            <div style={{ display: 'grid', gap: appleSpacing.md }}>
              {marketOverview.key_events.map((event, index) => (
                <div key={index} style={{
                  padding: appleSpacing.md,
                  backgroundColor: appleColors.background.secondary,
                  borderRadius: appleBorderRadius.md,
                  border: `1px solid ${appleColors.border.light}`
                }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: appleColors.text.primary,
                    marginBottom: appleSpacing.sm
                  }}>
                    {event.event}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: appleColors.text.secondary,
                    marginBottom: appleSpacing.xs
                  }}>
                    <strong>חשיבות:</strong> {event.importance}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: appleColors.text.secondary
                  }}>
                    <strong>השפעה:</strong> {event.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Sectors */}
        <div style={{
          marginBottom: appleSpacing.xl,
          backgroundColor: appleColors.background.primary,
          borderRadius: appleBorderRadius.lg,
          padding: appleSpacing.xl,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: appleSpacing.md,
            color: appleColors.text.primary
          }}>
            🔥 סקטורים חמים
          </h4>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: appleSpacing.sm
          }}>
            {marketOverview.trending_sectors?.map((sector, index) => (
              <span key={index} style={{
                backgroundColor: '#E3F2FD',
                color: appleColors.primary,
                padding: `${appleSpacing.sm} ${appleSpacing.md}`,
                borderRadius: appleBorderRadius.full,
                fontSize: '14px',
                fontWeight: 500
              }}>
                {sector}
              </span>
            )) || <span style={{ color: appleColors.text.tertiary }}>אין סקטורים חמים</span>}
          </div>
        </div>

        {/* Action Items */}
        {marketOverview.action_items?.length > 0 && (
          <div style={{
            backgroundColor: appleColors.background.primary,
            borderRadius: appleBorderRadius.lg,
            padding: appleSpacing.xl,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: appleSpacing.md,
              color: appleColors.text.primary
            }}>
              ✅ פעולות נדרשות
            </h4>
            <ul style={{
              margin: 0,
              paddingRight: appleSpacing.xl,
              listStyle: 'none'
            }}>
              {marketOverview.action_items.map((action, index) => (
                <li key={index} style={{
                  marginBottom: appleSpacing.sm,
                  padding: appleSpacing.md,
                  backgroundColor: '#E8F5E8',
                  borderRadius: appleBorderRadius.md,
                  border: `1px solid #C8E6C9`,
                  fontSize: '16px',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'absolute',
                    right: appleSpacing.md,
                    top: appleSpacing.md,
                    color: appleColors.success,
                    fontWeight: 700
                  }}>
                    {index + 1}.
                  </span>
                  <span style={{ paddingRight: appleSpacing.xl }}>
                    {action}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 