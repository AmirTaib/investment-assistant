import React from 'react';
import { SectorAnalysis as SectorAnalysisType } from '../types/insights';
import { theme } from '../styles/theme';
import { getSentimentColor } from '../utils/formatters';

interface SectorAnalysisProps {
  sectorAnalysis: SectorAnalysisType;
  index: number;
}

export const SectorAnalysis: React.FC<SectorAnalysisProps> = ({ sectorAnalysis, index }) => {
  const sentimentColor = getSentimentColor(sectorAnalysis.status);
  
  const getStatusBgColor = () => {
    switch (sentimentColor) {
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

  const getStatusBorderColor = () => {
    switch (sentimentColor) {
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

  const getStatusTextColor = () => {
    switch (sentimentColor) {
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
      backgroundColor: getStatusBgColor(),
      border: `3px solid ${getStatusBorderColor()}`,
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.shadows.lg,
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: theme.spacing[4],
        left: theme.spacing[4],
        backgroundColor: getStatusBorderColor(),
        color: theme.colors.text.inverse,
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        borderRadius: theme.borderRadius.full,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        textTransform: 'uppercase'
      }}>
        {sectorAnalysis.status}
      </div>

      {/* Header */}
      <div style={{
        fontWeight: theme.typography.fontWeight.bold,
        fontSize: theme.typography.fontSize['2xl'],
        marginBottom: theme.spacing[6],
        color: getStatusTextColor(),
        textAlign: 'center',
        marginTop: theme.spacing[4]
      }}>
        🏭 {sectorAnalysis.sector} - {sectorAnalysis.recommendation}
      </div>

      {/* Action Required */}
      <div style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        marginBottom: theme.spacing[6],
        boxShadow: theme.shadows.sm,
        border: `2px solid ${theme.colors.primary[200]}`
      }}>
        <h4 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          marginBottom: theme.spacing[4],
          color: theme.colors.primary[700]
        }}>
          🎯 פעולה נדרשת
        </h4>
        <p style={{
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.lineHeight.relaxed,
          color: theme.colors.text.primary,
          margin: 0
        }}>
          {sectorAnalysis.action_required}
        </p>
      </div>

      {/* Top Picks */}
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
          ⭐ מומלצות
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: theme.spacing[3]
        }}>
          {sectorAnalysis.top_picks?.map((pick, index) => (
            <span key={index} style={{
              backgroundColor: theme.colors.success[100],
              color: theme.colors.success[700],
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              border: `1px solid ${theme.colors.success[300]}`
            }}>
              {pick}
            </span>
          )) || <span style={{ color: theme.colors.text.muted }}>אין המלצות</span>}
        </div>
      </div>

      {/* Content Grid */}
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
            💡 סיבה
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            {sectorAnalysis.reason}
          </p>
        </div>

        {/* Portfolio Impact */}
        <div style={{
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[6],
          boxShadow: theme.shadows.sm,
          border: `1px solid ${theme.colors.primary[200]}`
        }}>
          <h4 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            marginBottom: theme.spacing[4],
            color: theme.colors.primary[700]
          }}>
            📊 השפעה על התיק
          </h4>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            lineHeight: theme.typography.lineHeight.relaxed,
            color: theme.colors.primary[700],
            margin: 0
          }}>
            {sectorAnalysis.portfolio_impact}
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
            {sectorAnalysis.risks}
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
            {sectorAnalysis.why_despite_risks}
          </p>
        </div>
      </div>
    </div>
  );
}; 