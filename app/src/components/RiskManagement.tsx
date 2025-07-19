import React from 'react';
import { RiskManagement as RiskManagementType } from '../types/insights';
import { theme } from '../styles/theme';
import { getPriorityColor } from '../utils/formatters';

interface RiskManagementProps {
  riskManagement: RiskManagementType;
}

export const RiskManagement: React.FC<RiskManagementProps> = ({ riskManagement }) => {
  const riskColor = getPriorityColor(riskManagement.current_risk);
  
  const getRiskBgColor = () => {
    switch (riskColor) {
      case 'danger':
        return theme.colors.danger[50];
      case 'warning':
        return theme.colors.warning[50];
      case 'success':
        return theme.colors.success[50];
      default:
        return theme.colors.neutral[50];
    }
  };

  const getRiskBorderColor = () => {
    switch (riskColor) {
      case 'danger':
        return theme.colors.danger[500];
      case 'warning':
        return theme.colors.warning[500];
      case 'success':
        return theme.colors.success[500];
      default:
        return theme.colors.neutral[300];
    }
  };

  const getRiskTextColor = () => {
    switch (riskColor) {
      case 'danger':
        return theme.colors.danger[700];
      case 'warning':
        return theme.colors.warning[700];
      case 'success':
        return theme.colors.success[700];
      default:
        return theme.colors.neutral[700];
    }
  };

  return (
    <div style={{
      marginBottom: theme.spacing[8],
      direction: 'rtl'
    }}>
      <h3 style={{
        fontSize: theme.typography.fontSize['3xl'],
        marginBottom: theme.spacing[6],
        color: theme.colors.text.primary,
        fontWeight: theme.typography.fontWeight.bold,
        textAlign: 'center',
        borderBottom: `3px solid ${theme.colors.neutral[500]}`,
        paddingBottom: theme.spacing[4]
      }}>
        🛡️ ניהול סיכונים
      </h3>
      
      <div style={{
        padding: theme.spacing[8],
        backgroundColor: getRiskBgColor(),
        borderRadius: theme.borderRadius['2xl'],
        fontSize: theme.typography.fontSize.lg,
        lineHeight: theme.typography.lineHeight.relaxed,
        border: `2px solid ${getRiskBorderColor()}`,
        boxShadow: theme.shadows.lg,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Risk Level Badge */}
        <div style={{
          position: 'absolute',
          top: theme.spacing[4],
          left: theme.spacing[4],
          backgroundColor: getRiskBorderColor(),
          color: theme.colors.text.inverse,
          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
          borderRadius: theme.borderRadius.full,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.bold,
          textTransform: 'uppercase'
        }}>
          סיכון {riskManagement.current_risk || 'לא מוגדר'}
        </div>

        {/* Risk Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: theme.spacing[6],
          marginBottom: theme.spacing[8],
          marginTop: theme.spacing[4]
        }}>
          {/* Current Risk */}
          <div style={{
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing[6],
            boxShadow: theme.shadows.sm,
            border: `2px solid ${getRiskBorderColor()}`
          }}>
            <h4 style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              marginBottom: theme.spacing[4],
              color: getRiskTextColor()
            }}>
              📊 רמת סיכון נוכחית
            </h4>
            <div style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: getRiskTextColor(),
              textAlign: 'center'
            }}>
              {riskManagement.current_risk || 'לא מוגדר'}
            </div>
          </div>

          {/* Risk Type */}
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
              🎯 סוג סיכון
            </h4>
            <div style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary
            }}>
              {riskManagement.risk_type || 'לא מוגדר'}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div style={{
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          marginBottom: theme.spacing[6],
          boxShadow: theme.shadows.sm
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.text.primary
          }}>
            📝 הסבר
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            {riskManagement.explanation || 'אין הסבר'}
          </p>
        </div>

        {/* Immediate Actions */}
        <div style={{
          backgroundColor: theme.colors.danger[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          marginBottom: theme.spacing[6],
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.danger[200]}`
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.danger[700]
          }}>
            ⚡ פעולות מיידיות
          </h4>
          <ul style={{
            margin: 0,
            paddingRight: theme.spacing[6],
            listStyle: 'none'
          }}>
            {riskManagement.immediate_actions?.map((action, index) => (
              <li key={index} style={{
                marginBottom: theme.spacing[3],
                padding: theme.spacing[3],
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.danger[300]}`,
                fontSize: theme.typography.fontSize.base,
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: theme.spacing[3],
                  top: theme.spacing[3],
                  color: theme.colors.danger[600],
                  fontWeight: theme.typography.fontWeight.bold
                }}>
                  {index + 1}.
                </span>
                <span style={{ paddingRight: theme.spacing[8] }}>
                  {action}
                </span>
              </li>
            )) || <li style={{ color: theme.colors.text.muted }}>אין פעולות מיידיות</li>}
          </ul>
        </div>

        {/* Stop Loss Levels */}
        <div style={{
          backgroundColor: theme.colors.warning[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          marginBottom: theme.spacing[6],
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.warning[200]}`
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.warning[700]
          }}>
            🛑 רמות סטופ לוס
          </h4>
          <ul style={{
            margin: 0,
            paddingRight: theme.spacing[6],
            listStyle: 'none'
          }}>
            {riskManagement.stop_loss_levels?.map((level, index) => (
              <li key={index} style={{
                marginBottom: theme.spacing[3],
                padding: theme.spacing[3],
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.warning[300]}`,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.warning[700]
              }}>
                {level}
              </li>
            )) || <li style={{ color: theme.colors.text.muted }}>אין רמות סטופ לוס</li>}
          </ul>
        </div>

        {/* Hedging Strategies */}
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
            🛡️ אסטרטגיות הגנה
          </h4>
          <ul style={{
            margin: 0,
            paddingRight: theme.spacing[6],
            listStyle: 'none'
          }}>
            {riskManagement.hedging_strategies?.map((strategy, index) => (
              <li key={index} style={{
                marginBottom: theme.spacing[3],
                padding: theme.spacing[3],
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.success[300]}`,
                fontSize: theme.typography.fontSize.base,
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: theme.spacing[3],
                  top: theme.spacing[3],
                  color: theme.colors.success[600],
                  fontWeight: theme.typography.fontWeight.bold
                }}>
                  {index + 1}.
                </span>
                <span style={{ paddingRight: theme.spacing[8] }}>
                  {strategy}
                </span>
              </li>
            )) || <li style={{ color: theme.colors.text.muted }}>אין אסטרטגיות הגנה</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}; 