import React from 'react';
import { Recommendation as RecommendationType } from '../types/insights';
import { getActionColor } from '../utils/formatters';
import { AlertPopup, ConfirmPopup } from './Popup';
import { useAlert } from '../hooks/useAlert';

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

interface RecommendationProps {
  recommendation: RecommendationType;
  index: number;
}

export const Recommendation: React.FC<RecommendationProps> = ({ recommendation, index }) => {
  const actionColor = getActionColor(recommendation.action);
  const { alert, showSuccess, hideAlert } = useAlert();
  const [showConfirmChat, setShowConfirmChat] = React.useState(false);
  
  const getActionBgColor = () => {
    switch (actionColor) {
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

  const getActionBorderColor = () => {
    switch (actionColor) {
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

  const openChatGPT = () => {
    setShowConfirmChat(true);
  };

  const handleConfirmChat = () => {
    const context = `
Investment Recommendation Context:

📈 Stock: ${recommendation.symbol}
🎯 Action: ${recommendation.action}
💰 Current Price: ${recommendation.current_price}
📊 Target Price: ${recommendation.target_price}
⏰ Timeframe: ${recommendation.timeframe}
🎯 Confidence: ${recommendation.confidence}
📊 Type: ${recommendation.type}

📋 Reason:
${recommendation.reason}

🚀 Catalyst:
${recommendation.catalyst}

⚠️ Risks:
${recommendation.risks}

✅ Why Despite Risks:
${recommendation.why_despite_risks}

💰 Investment Details:
• Amount: ${recommendation.amount_ils}
• Portfolio %: ${recommendation.percentage_of_portfolio}
• Stop Loss: ${recommendation.stop_loss}

Please help me understand this investment recommendation better. I'd like to discuss:
1. The reasoning behind this recommendation
2. The potential risks and how to mitigate them
3. Alternative investment strategies
4. Market conditions that could affect this recommendation
5. Any additional research I should do

What are your thoughts on this recommendation?
    `;
    
    // Copy context to clipboard
    navigator.clipboard.writeText(context).then(() => {
      // Show success popup
      showSuccess(
        'הקונטקסט הועתק!',
        'הקונטקסט הועתק ללוח בהצלחה. עכשיו נפתח ChatGPT...',
        3000
      );
      
      // Open ChatGPT in new tab after a short delay
      setTimeout(() => {
        window.open('https://chat.openai.com', '_blank');
      }, 500);
    }).catch(() => {
      // Fallback if clipboard fails
      showSuccess(
        'פתיחת ChatGPT',
        'נפתח ChatGPT בחלון חדש...',
        2000
      );
      window.open('https://chat.openai.com', '_blank');
    });
  };

  return (
    <>
      <div style={{
        padding: appleSpacing.xl,
        backgroundColor: getActionBgColor(),
        borderRadius: appleBorderRadius['2xl'],
        border: `2px solid ${getActionBorderColor()}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        direction: 'rtl',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Action Badge */}
        <div style={{
          position: 'absolute',
          top: appleSpacing.md,
          left: appleSpacing.md,
          backgroundColor: getActionBorderColor(),
          color: '#FFFFFF',
          padding: `${appleSpacing.xs} ${appleSpacing.sm}`,
          borderRadius: appleBorderRadius.full,
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase',
          zIndex: 1
        }}>
          {recommendation.action}
        </div>

        {/* ChatGPT Button */}
        <button
          onClick={openChatGPT}
          style={{
            position: 'absolute',
            top: appleSpacing.md,
            right: appleSpacing.md,
            backgroundColor: appleColors.primary,
            color: '#FFFFFF',
            border: 'none',
            padding: `${appleSpacing.sm} ${appleSpacing.md}`,
            borderRadius: appleBorderRadius.full,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: appleSpacing.xs,
            zIndex: 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056CC';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = appleColors.primary;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          💬 ChatGPT
        </button>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: appleSpacing.xl,
          paddingTop: appleSpacing.lg
        }}>
          <h4 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: appleColors.text.primary,
            marginBottom: appleSpacing.md
          }}>
            {recommendation.symbol}
          </h4>
          <div style={{
            fontSize: '18px',
            color: appleColors.text.secondary,
            marginBottom: appleSpacing.sm
          }}>
            {recommendation.current_price} → {recommendation.target_price}
          </div>
          <div style={{
            fontSize: '16px',
            color: appleColors.text.tertiary
          }}>
            {recommendation.timeframe} • ביטחון: {recommendation.confidence}
          </div>
        </div>

        {/* Investment Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: appleSpacing.md,
          marginBottom: appleSpacing.xl,
          backgroundColor: appleColors.background.primary,
          padding: appleSpacing.lg,
          borderRadius: appleBorderRadius.lg,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '14px',
              color: appleColors.text.secondary,
              marginBottom: appleSpacing.xs
            }}>
              סכום השקעה
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: appleColors.text.primary
            }}>
              {recommendation.amount_ils}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '14px',
              color: appleColors.text.secondary,
              marginBottom: appleSpacing.xs
            }}>
              אחוז תיק
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: appleColors.text.primary
            }}>
              {recommendation.percentage_of_portfolio}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '14px',
              color: appleColors.text.secondary,
              marginBottom: appleSpacing.xs
            }}>
              סטופ לוס
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: appleColors.text.primary
            }}>
              {recommendation.stop_loss}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div style={{
          marginBottom: appleSpacing.xl,
          backgroundColor: appleColors.background.primary,
          padding: appleSpacing.lg,
          borderRadius: appleBorderRadius.lg,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h5 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: appleSpacing.md,
            color: appleColors.text.primary
          }}>
            📋 סיבה להמלצה
          </h5>
          <div style={{
            padding: appleSpacing.md,
            backgroundColor: '#E8F5E8',
            borderRadius: appleBorderRadius.md,
            border: `1px solid #C8E6C9`,
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            {recommendation.reason}
          </div>
        </div>

        {/* Catalyst */}
        <div style={{
          marginBottom: appleSpacing.xl,
          backgroundColor: appleColors.background.primary,
          padding: appleSpacing.lg,
          borderRadius: appleBorderRadius.lg,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h5 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: appleSpacing.md,
            color: appleColors.text.primary
          }}>
            🚀 קטליזטור
          </h5>
          <div style={{
            padding: appleSpacing.md,
            backgroundColor: '#FFF8E8',
            borderRadius: appleBorderRadius.md,
            border: `1px solid #FFE0B2`,
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            {recommendation.catalyst}
          </div>
        </div>

        {/* Risks */}
        <div style={{
          marginBottom: appleSpacing.xl,
          backgroundColor: appleColors.background.primary,
          padding: appleSpacing.lg,
          borderRadius: appleBorderRadius.lg,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h5 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: appleSpacing.md,
            color: appleColors.text.primary
          }}>
            ⚠️ סיכונים
          </h5>
          <div style={{
            padding: appleSpacing.md,
            backgroundColor: '#FFE8E8',
            borderRadius: appleBorderRadius.md,
            border: `1px solid #FFCDD2`,
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            {recommendation.risks}
          </div>
        </div>

        {/* Why Despite Risks */}
        <div style={{
          backgroundColor: appleColors.background.primary,
          padding: appleSpacing.lg,
          borderRadius: appleBorderRadius.lg,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h5 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: appleSpacing.md,
            color: appleColors.text.primary
          }}>
            ✅ למה בכל זאת
          </h5>
          <div style={{
            padding: appleSpacing.md,
            backgroundColor: '#E8F5E8',
            borderRadius: appleBorderRadius.md,
            border: `1px solid #C8E6C9`,
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            {recommendation.why_despite_risks}
          </div>
        </div>
      </div>

      {/* Alert Popup */}
      <AlertPopup
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      {/* Confirm Chat Popup */}
      <ConfirmPopup
        isOpen={showConfirmChat}
        onClose={() => setShowConfirmChat(false)}
        onConfirm={handleConfirmChat}
        title="פתיחת ChatGPT"
        message={`האם ברצונך לפתוח ChatGPT עם הקונטקסט של המלצת ההשקעה עבור ${recommendation.symbol}?

הקונטקסט יכלול:
• פרטי ההמלצה המלאים
• סיבות וקטליזטורים
• סיכונים ומידע נוסף
• שאלות מנחות לדיון

הקונטקסט יועתק ללוח ו-ChatGPT ייפתח בחלון חדש.`}
        confirmText="פתח ChatGPT"
        cancelText="ביטול"
        type="info"
      />
    </>
  );
}; 