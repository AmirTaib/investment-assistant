import React from 'react';
import { useInsights } from '../hooks/useInsights';
import { formatTimestamp } from '../utils/formatters';
import { APP_CONSTANTS } from '../config';
import { MarketOverview } from '../components/MarketOverview';
import { Recommendation } from '../components/Recommendation';
import { SectorAnalysis } from '../components/SectorAnalysis';
import { Alert } from '../components/Alert';
import { RiskManagement } from '../components/RiskManagement';
import { Insight } from '../types/insights';
import {
  PageContainer,
  ContentContainer,
  PageHeader,
  PageTitle,
  StatusBadge,
  LoadingContainer,
  ErrorContainer,
  EmptyStateContainer,
  InsightCard,
  NewBadge,
  InsightHeader,
  InsightMeta,
  InsightTitle,
  SectionHeader,
  SectionContainer,
  SectionGrid,
  StatsContainer,
} from '../components/StyledComponents';

export const InsightsPage: React.FC = () => {
  const { insights, loading, error } = useInsights();

  if (loading) {
    return <LoadingContainer />;
  }

  if (error) {
    return <ErrorContainer error={error} />;
  }

  return (
    <PageContainer>
      <ContentContainer>
        <PageHeader>
          <PageTitle>{APP_CONSTANTS.APP_NAME} - תובנות השקעה</PageTitle>
          <StatusBadge>✅ עדכונים בזמן אמת מופעלים - תובנות חדשות יופיעו אוטומטית</StatusBadge>
        </PageHeader>

        {insights.length === 0 ? (
          <EmptyStateContainer />
        ) : (
          <>
            <StatsContainer>
              מציג {insights.length} תובנות (החדשות ביותר קודם)
            </StatsContainer>

            <div style={{ display: 'grid', gap: '48px' }}>
              {insights.map((insight: Insight, index: number) => (
                <InsightCard key={insight.id || insight.doc_id || index} isLatest={index === 0} index={index}>
                  {index === 0 && <NewBadge />}
                  
                  <InsightHeader isLatest={index === 0}>
                    <InsightMeta 
                      timestamp={formatTimestamp(insight.timestamp)}
                      currency={insight.currency}
                      source={insight.source}
                    />
                    {insight.title && <InsightTitle>{insight.title}</InsightTitle>}
                  </InsightHeader>

                  {/* Legacy support for old format */}
                  {insight.message ? (
                    <div style={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      backgroundColor: '#F2F2F7',
                      padding: '24px',
                      borderRadius: '16px',
                      border: '1px solid #C6C6C8',
                    }}>
                      {insight.message}
                    </div>
                  ) : (
                    <div>
                      {/* Market Overview */}
                      {insight.market_overview && (
                        <MarketOverview marketOverview={insight.market_overview} />
                      )}

                      {/* Recommendations */}
                      {insight.recommendations?.length > 0 && (
                        <SectionContainer>
                          <SectionHeader color="#34C759">
                            💰 המלצות השקעה
                          </SectionHeader>
                          <SectionGrid>
                            {insight.recommendations.map((rec, recIndex) => (
                              <Recommendation key={recIndex} recommendation={rec} index={recIndex} />
                            ))}
                          </SectionGrid>
                        </SectionContainer>
                      )}

                      {/* Sector Analysis */}
                      {insight.sector_analysis?.length > 0 && (
                        <SectionContainer>
                          <SectionHeader color="#FF9500">
                            🏭 ניתוח סקטורים
                          </SectionHeader>
                          <SectionGrid>
                            {insight.sector_analysis.map((sector, sectorIndex) => (
                              <SectorAnalysis key={sectorIndex} sectorAnalysis={sector} index={sectorIndex} />
                            ))}
                          </SectionGrid>
                        </SectionContainer>
                      )}

                      {/* Alerts */}
                      {insight.alerts?.length > 0 && (
                        <SectionContainer>
                          <SectionHeader color="#FF3B30">
                            ⚠️ התראות
                          </SectionHeader>
                          <SectionGrid>
                            {insight.alerts.map((alert, alertIndex) => (
                              <Alert key={alertIndex} alert={alert} index={alertIndex} />
                            ))}
                          </SectionGrid>
                        </SectionContainer>
                      )}

                      {/* Risk Management */}
                      {insight.risk_management && (
                        <RiskManagement riskManagement={insight.risk_management} />
                      )}
                    </div>
                  )}
                </InsightCard>
              ))}
            </div>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
}; 