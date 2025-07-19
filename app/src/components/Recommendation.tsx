import React from 'react';
import { Recommendation as RecommendationType } from '../types/insights';
import { theme } from '../styles/theme';
import { getActionColor } from '../utils/formatters';

interface RecommendationProps {
  recommendation: RecommendationType;
  index: number;
}

export const Recommendation: React.FC<RecommendationProps> = ({ recommendation, index }) => {
  const actionColor = getActionColor(recommendation.action);
  
  const getActionBgColor = () => {
    switch (actionColor) {
      case 'success':
        return theme.colors.success[50];
      case 'danger':
        return theme.colors.danger[50];
      case 'warning':
        return theme.colors.warning[50];
      default:
        return theme.colors.neutral[50];
    }
  };

  const getActionBorderColor = () => {
    switch (actionColor) {
      case 'success':
        return theme.colors.success[500];
      case 'danger':
        return theme.colors.danger[500];
      case 'warning':
        return theme.colors.warning[500];
      default:
        return theme.colors.neutral[300];
    }
  };

  const getActionTextColor = () => {
    switch (actionColor) {
      case 'success':
        return theme.colors.success[700];
      case 'danger':
        return theme.colors.danger[700];
      case 'warning':
        return theme.colors.warning[700];
      default:
        return theme.colors.neutral[700];
    }
  };

  return (
    <div style={{
      padding: theme.spacing[8],
      margin: `${theme.spacing[6]} 0`,
      backgroundColor: getActionBgColor(),
      border: `3px solid ${getActionBorderColor()}`,
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.shadows.lg,
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Action Badge */}
      <div style={{
        position: 'absolute',
        top: theme.spacing[4],
        left: theme.spacing[4],
        backgroundColor: getActionBorderColor(),
        color: theme.colors.text.inverse,
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        borderRadius: theme.borderRadius.full,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        textTransform: 'uppercase'
      }}>
        {recommendation.action_hebrew}
      </div>

      {/* Header */}
      <div style={{
        fontWeight: theme.typography.fontWeight.bold,
        fontSize: theme.typography.fontSize['2xl'],
        marginBottom: theme.spacing[6],
        color: getActionTextColor(),
        textAlign: 'center',
        marginTop: theme.spacing[4]
      }}>
        {recommendation.symbol} - {recommendation.type}
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing[4],
        marginBottom: theme.spacing[6],
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        boxShadow: theme.shadows.sm
      }}>
        <div style={{
          textAlign: 'center',
          padding: theme.spacing[4],
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.primary[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}>
            סכום השקעה
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary
          }}>
            {recommendation.amount_ils} ש"ח
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary
          }}>
            ({recommendation.percentage_of_portfolio})
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: theme.spacing[4],
          backgroundColor: theme.colors.success[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.success[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}>
            מחיר נוכחי
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary
          }}>
            {recommendation.current_price}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: theme.spacing[4],
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.primary[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}>
            מחיר יעד
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.success[600]
          }}>
            {recommendation.target_price}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: theme.spacing[4],
          backgroundColor: theme.colors.danger[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.danger[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}>
            סטופ לוס
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.danger[600]
          }}>
            {recommendation.stop_loss}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: theme.spacing[4],
          backgroundColor: theme.colors.warning[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.warning[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}>
            רמת ביטחון
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.warning[600]
          }}>
            {recommendation.confidence}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: theme.spacing[4],
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.neutral[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing[1]
          }}>
            טווח זמן
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary
          }}>
            {recommendation.timeframe}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div style={{ display: 'grid', gap: theme.spacing[6] }}>
        {/* Reason */}
        <div style={{
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          boxShadow: theme.shadows.sm
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.text.primary
          }}>
            💡 סיבה להמלצה
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            {recommendation.reason}
          </p>
        </div>

        {/* Catalyst */}
        <div style={{
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          boxShadow: theme.shadows.sm
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.text.primary
          }}>
            ⚡ זרז/אירוע
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            {recommendation.catalyst}
          </p>
        </div>

        {/* Risks */}
        <div style={{
          backgroundColor: theme.colors.danger[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.danger[200]}`
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.danger[700]
          }}>
            ⚠️ סיכונים
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.danger[700],
            margin: 0
          }}>
            {recommendation.risks}
          </p>
        </div>

        {/* Why Despite Risks */}
        <div style={{
          backgroundColor: theme.colors.success[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.success[200]}`
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.success[700]
          }}>
            ✅ למה בכל זאת
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.success[700],
            margin: 0
          }}>
            {recommendation.why_despite_risks}
          </p>
        </div>
      </div>
    </div>
  );
}; 