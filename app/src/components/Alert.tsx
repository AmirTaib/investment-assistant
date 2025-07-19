import React from 'react';
import { Alert as AlertType } from '../types/insights';
import { theme } from '../styles/theme';
import { getPriorityColor } from '../utils/formatters';

interface AlertProps {
  alert: AlertType;
  index: number;
}

export const Alert: React.FC<AlertProps> = ({ alert, index }) => {
  const priorityColor = getPriorityColor(alert.priority);
  
  const getPriorityBgColor = () => {
    switch (priorityColor) {
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

  const getPriorityBorderColor = () => {
    switch (priorityColor) {
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

  const getPriorityTextColor = () => {
    switch (priorityColor) {
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

  const getUrgencyIcon = () => {
    switch (alert.urgency) {
      case 'דחוף':
        return '🚨';
      case 'בינוני':
        return '⚠️';
      case 'לא דחוף':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getTypeIcon = () => {
    switch (alert.type) {
      case 'רווחים':
        return '💰';
      case 'חדשות':
        return '📰';
      case 'טכני':
        return '📈';
      default:
        return '📢';
    }
  };

  return (
    <div style={{
      padding: theme.spacing[8],
      margin: `${theme.spacing[6]} 0`,
      backgroundColor: getPriorityBgColor(),
      border: `3px solid ${getPriorityBorderColor()}`,
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.shadows.lg,
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Priority Badge */}
      <div style={{
        position: 'absolute',
        top: theme.spacing[4],
        left: theme.spacing[4],
        backgroundColor: getPriorityBorderColor(),
        color: theme.colors.text.inverse,
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        borderRadius: theme.borderRadius.full,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        textTransform: 'uppercase'
      }}>
        {alert.priority}
      </div>

      {/* Header */}
      <div style={{
        fontWeight: theme.typography.fontWeight.bold,
        fontSize: theme.typography.fontSize['2xl'],
        marginBottom: theme.spacing[6],
        color: getPriorityTextColor(),
        textAlign: 'center',
        marginTop: theme.spacing[4]
      }}>
        {getTypeIcon()} {alert.type} - {alert.symbol} - {getUrgencyIcon()} {alert.urgency}
      </div>

      {/* Alert Message */}
      <div style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        marginBottom: theme.spacing[6],
        boxShadow: theme.shadows.sm,
        border: `2px solid ${theme.colors.border.light}`
      }}>
        <h4 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: theme.spacing[4],
          color: theme.colors.text.primary
        }}>
          📢 התראה
        </h4>
        <p style={{
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.lineHeight.relaxed,
          color: theme.colors.text.primary,
          margin: 0
        }}>
          {alert.message}
        </p>
      </div>

      {/* Action Required */}
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
          🎯 פעולה נדרשת
        </h4>
        <p style={{
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.lineHeight.relaxed,
          color: theme.colors.danger[700],
          margin: 0
        }}>
          {alert.action_required}
        </p>
      </div>

      {/* Immediate Action */}
      <div style={{
        backgroundColor: theme.colors.warning[50],
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        boxShadow: theme.shadows.sm,
        border: `1px solid ${theme.colors.warning[200]}`
      }}>
        <h4 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: theme.spacing[4],
          color: theme.colors.warning[700]
        }}>
          ⚡ פעולה מיידית
        </h4>
        <p style={{
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.lineHeight.relaxed,
          color: theme.colors.warning[700],
          margin: 0
        }}>
          {alert.immediate_action}
        </p>
      </div>
    </div>
  );
}; 