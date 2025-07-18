import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, query, orderBy, limit, DocumentData } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig, FIRESTORE_COLLECTIONS, APP_CONSTANTS, UI_CONSTANTS } from './config';

interface KeyEvent {
  event: string;
  importance: string;
  impact: string;
}

interface MarketOverview {
  summary: string;
  sentiment: 'חיובי' | 'שלילי' | 'ניטרלי';
  key_events: KeyEvent[];
  trending_sectors: string[];
  action_items: string[];
}

interface Recommendation {
  symbol: string;
  action: 'לקנות' | 'למכור' | 'להחזיק';
  action_hebrew: string;
  amount_ils: string;
  percentage_of_portfolio: string;
  current_price: string;
  target_price: string;
  stop_loss: string;
  confidence: 'גבוה' | 'בינוני' | 'נמוך';
  reason: string;
  timeframe: string;
  risks: string;
  why_despite_risks: string;
  type: 'קצר טווח' | 'ארוך טווח';
}

interface SectorAnalysis {
  sector: string;
  status: 'חיובי' | 'שלילי' | 'ניטרלי';
  recommendation: 'לקנות' | 'להחזיק' | 'להימנע';
  action_required: string;
  top_picks: string[];
  reason: string;
  risks: string;
  why_despite_risks: string;
  portfolio_impact: string;
}

interface Alert {
  type: 'רווחים' | 'חדשות' | 'טכני';
  symbol: string;
  message: string;
  priority: 'גבוה' | 'בינוני' | 'נמוך';
  action_required: string;
  urgency: 'דחוף' | 'בינוני' | 'לא דחוף';
  difference_from_recommendations: string;
  immediate_action: string;
}

interface RiskManagement {
  current_risk: 'גבוה' | 'בינוני' | 'נמוך';
  risk_type: string;
  explanation: string;
  immediate_actions: string[];
  stop_loss_levels: string[];
  hedging_strategies: string[];
}

interface Insight {
  timestamp: string;
  title: string;
  date: string;
  currency: string;
  source: string;
  generated_at: string;
  type: string;
  market_overview: MarketOverview;
  recommendations: Recommendation[];
  sector_analysis: SectorAnalysis[];
  alerts: Alert[];
  risk_management: RiskManagement;
  id?: string;
  doc_id?: string;
  // Legacy support
  message?: string;
  portfolio_analysis?: any;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App(): JSX.Element {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create a query for real-time updates
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.DAILY_INSIGHTS),
      orderBy("timestamp", "desc"), // Most recent first
      limit(APP_CONSTANTS.INSIGHTS_LIMIT) // Limit to last 20 insights
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const data: Insight[] = querySnapshot.docs.map(doc => ({
            ...doc.data() as Insight,
            id: doc.id,
            doc_id: doc.id
          }));
          setInsights(data);
          setLoading(false);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : APP_CONSTANTS.ERROR_MESSAGES.LOADING_FAILED);
          setLoading(false);
        }
      },
      (err) => {
        // Handle real-time listener errors
        setError(`Real-time listener error: ${err.message}`);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  // Render recommendation
  const renderRecommendation = (rec: Recommendation, index: number) => (
    <div key={index} style={{
      padding: '20px',
      margin: '15px 0',
      backgroundColor: rec.action === 'לקנות' ? '#d4edda' : rec.action === 'למכור' ? '#f8d7da' : '#fff3cd',
      border: `3px solid ${rec.action === 'לקנות' ? '#27ae60' : rec.action === 'למכור' ? '#e74c3c' : '#f39c12'}`,
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      direction: 'rtl'
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: '22px',
        marginBottom: '10px',
        color: rec.action === 'לקנות' ? '#27ae60' : rec.action === 'למכור' ? '#e74c3c' : '#f39c12'
      }}>
        {rec.symbol} - {rec.action_hebrew} ({rec.type})
      </div>
      <div style={{ 
        fontSize: '18px', 
        color: '#2c3e50',
        marginBottom: '15px',
        fontWeight: '500'
      }}>
        <strong>סכום:</strong> {rec.amount_ils} ש"ח ({rec.percentage_of_portfolio}) | <strong>מחיר נוכחי:</strong> {rec.current_price} | <strong>יעד:</strong> {rec.target_price} | <strong>סטופ:</strong> {rec.stop_loss} | <strong>ביטחון:</strong> {rec.confidence}
      </div>
      <div style={{ 
        fontSize: '16px', 
        marginTop: '10px',
        lineHeight: '1.6',
        color: '#34495e'
      }}>
        <strong>סיבה:</strong> {rec.reason}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#e74c3c', 
        marginTop: '10px',
        fontWeight: '500'
      }}>
        <strong>סיכונים:</strong> {rec.risks}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#27ae60', 
        marginTop: '5px',
        fontWeight: '500'
      }}>
        <strong>למה בכל זאת:</strong> {rec.why_despite_risks}
      </div>
      <div style={{ 
        fontSize: '14px', 
        color: '#7f8c8d', 
        marginTop: '10px',
        fontWeight: '500'
      }}>
        <strong>טווח זמן:</strong> {rec.timeframe}
      </div>
    </div>
  );

  // Render sector analysis
  const renderSectorAnalysis = (sector: SectorAnalysis, index: number) => (
    <div key={index} style={{
      padding: '20px',
      margin: '15px 0',
      backgroundColor: sector.status === 'חיובי' ? '#d4edda' : sector.status === 'שלילי' ? '#f8d7da' : '#fff3cd',
      border: `3px solid ${sector.status === 'חיובי' ? '#27ae60' : sector.status === 'שלילי' ? '#e74c3c' : '#f39c12'}`,
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      direction: 'rtl'
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: '20px',
        marginBottom: '10px',
        color: sector.status === 'חיובי' ? '#27ae60' : sector.status === 'שלילי' ? '#e74c3c' : '#f39c12'
      }}>
        {sector.sector} - {sector.status} ({sector.recommendation})
      </div>
      <div style={{ fontSize: '16px', color: '#2c3e50', marginBottom: '10px', fontWeight: '500' }}>
        <strong>פעולה נדרשת:</strong> {sector.action_required}
      </div>
      <div style={{ fontSize: '16px', color: '#2c3e50', marginBottom: '10px', fontWeight: '500' }}>
        <strong>מומלצות:</strong> {sector.top_picks?.join(', ') || 'אין המלצות'}
      </div>
      <div style={{ fontSize: '16px', marginTop: '10px', lineHeight: '1.6', color: '#34495e' }}>
        <strong>סיבה:</strong> {sector.reason}
      </div>
      <div style={{ fontSize: '14px', color: '#e74c3c', marginTop: '10px', fontWeight: '500' }}>
        <strong>סיכונים:</strong> {sector.risks}
      </div>
      <div style={{ fontSize: '14px', color: '#27ae60', marginTop: '5px', fontWeight: '500' }}>
        <strong>למה בכל זאת:</strong> {sector.why_despite_risks}
      </div>
      <div style={{ fontSize: '14px', color: '#3498db', marginTop: '5px', fontWeight: '500' }}>
        <strong>השפעה על התיק:</strong> {sector.portfolio_impact}
      </div>
    </div>
  );

  // Render alert
  const renderAlert = (alert: Alert, index: number) => (
    <div key={index} style={{
      padding: '20px',
      margin: '15px 0',
      backgroundColor: alert.priority === 'גבוה' ? '#f8d7da' : alert.priority === 'בינוני' ? '#fff3cd' : '#d1ecf1',
      border: `3px solid ${alert.priority === 'גבוה' ? '#e74c3c' : alert.priority === 'בינוני' ? '#f39c12' : '#3498db'}`,
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      direction: 'rtl'
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        fontSize: '20px',
        marginBottom: '10px',
        color: alert.priority === 'גבוה' ? '#e74c3c' : alert.priority === 'בינוני' ? '#f39c12' : '#3498db'
      }}>
        {alert.type} - {alert.symbol} ({alert.priority}) - {alert.urgency}
      </div>
      <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#34495e', marginBottom: '10px' }}>
        <strong>התראה:</strong> {alert.message}
      </div>
      <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#e74c3c', marginBottom: '10px' }}>
        <strong>פעולה נדרשת:</strong> {alert.action_required}
      </div>
      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#f39c12', marginBottom: '10px' }}>
        <strong>פעולה מיידית:</strong> {alert.immediate_action}
      </div>
      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#3498db' }}>
        <strong>הבדל מהמלצות:</strong> {alert.difference_from_recommendations}
      </div>
    </div>
  );

  // Render insight content
  const renderInsightContent = (insight: Insight) => {
    // Safety check for malformed data
    if (!insight) {
      return (
        <div style={{ fontSize: '14px', color: 'red', padding: '10px' }}>
          נתון לא תקין - אין מידע להצגה
        </div>
      );
    }

    // Legacy support for old format
    if (insight.message) {
      return (
        <div style={{ fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
          {insight.message}
        </div>
      );
    }

    // New format
    return (
      <div>
        {/* Market Overview */}
        {insight.market_overview && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              borderBottom: '3px solid #3498db',
              paddingBottom: '10px'
            }}>
              📊 סקירת שוק
            </h3>
            <div style={{ 
              padding: '20px', 
              backgroundColor: insight.market_overview.sentiment === 'חיובי' ? '#d4edda' : insight.market_overview.sentiment === 'שלילי' ? '#f8d7da' : '#fff3cd',
              borderRadius: '12px',
              fontSize: '18px',
              lineHeight: '1.6',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '15px',
                fontSize: '20px',
                color: '#2c3e50'
              }}>
                {insight.market_overview.sentiment || 'לא מוגדר'} - {insight.market_overview.summary || 'אין סיכום'}
              </div>
                              {insight.market_overview.key_events?.length > 0 && (
                  <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                    <strong>אירועים חשובים:</strong>
                    <ul style={{ margin: '10px 0', paddingRight: '20px' }}>
                      {insight.market_overview.key_events.map((event, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>
                          <strong>{event.event}</strong> - {event.importance} | <em>השפעה:</em> {event.impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              <div style={{ fontSize: '16px', color: '#666' }}>
                <strong>סקטורים חמים:</strong> {insight.market_overview.trending_sectors?.join(', ') || 'אין סקטורים חמים'}
              </div>
              {insight.market_overview.action_items?.length > 0 && (
                <div style={{ fontSize: '16px', color: '#2c3e50', marginTop: '15px', fontWeight: 'bold' }}>
                  <strong>פעולות נדרשות:</strong>
                  <ul style={{ margin: '10px 0', paddingRight: '20px' }}>
                    {insight.market_overview.action_items.map((action, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {insight.recommendations?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              borderBottom: '3px solid #27ae60',
              paddingBottom: '10px'
            }}>
              💰 המלצות השקעה
            </h3>
            {insight.recommendations.map((rec, index) => renderRecommendation(rec, index))}
          </div>
        )}



        {/* Sector Analysis */}
        {insight.sector_analysis?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              borderBottom: '3px solid #e67e22',
              paddingBottom: '10px'
            }}>
              🏭 ניתוח סקטורים
            </h3>
            {insight.sector_analysis.map((sector, index) => renderSectorAnalysis(sector, index))}
          </div>
        )}

        {/* Alerts */}
        {insight.alerts?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              borderBottom: '3px solid #e74c3c',
              paddingBottom: '10px'
            }}>
              ⚠️ התראות
            </h3>
            {insight.alerts.map((alert, index) => renderAlert(alert, index))}
          </div>
        )}

        {/* Risk Management */}
        {insight.risk_management && (
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '15px', 
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              borderBottom: '3px solid #34495e',
              paddingBottom: '10px'
            }}>
              🛡️ ניהול סיכונים
            </h3>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              fontSize: '18px',
              border: '2px solid #e0e0e0',
              direction: 'rtl'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>סיכון נוכחי:</strong> {insight.risk_management.current_risk || 'לא מוגדר'}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>סוג סיכון:</strong> {insight.risk_management.risk_type || 'לא מוגדר'}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>הסבר:</strong> {insight.risk_management.explanation || 'אין הסבר'}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>פעולות מיידיות:</strong>
                <ul style={{ margin: '10px 0', paddingRight: '20px', fontSize: '16px' }}>
                  {insight.risk_management.immediate_actions?.map((action, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{action}</li>
                  )) || []}
                </ul>
              </div>
              <div>
                <strong>רמות סטופ לוס:</strong>
                <ul style={{ margin: '10px 0', paddingRight: '20px', fontSize: '16px' }}>
                  {insight.risk_management.stop_loss_levels?.map((level, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{level}</li>
                  )) || []}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        direction: 'rtl',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '18px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '15px', color: '#2c3e50' }}>
          טוען תובנות...
        </div>
        <div style={{ fontSize: '16px', color: '#666' }}>
          עדכונים בזמן אמת מופעלים - תובנות חדשות יופיעו אוטומטית
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '50px', 
        color: '#e74c3c',
        direction: 'rtl',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '18px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '15px' }}>
          שגיאה: {error}
        </div>
        <div style={{ fontSize: '16px', marginTop: '15px' }}>
          נסה לרענן את הדף או בדוק את החיבור שלך
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      direction: 'rtl',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontSize: '16px',
      lineHeight: '1.6'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: '#2c3e50',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {APP_CONSTANTS.APP_NAME} - תובנות השקעה
      </h1>
      <div style={{ 
        fontSize: '18px', 
        color: '#2c3e50', 
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '10px',
        border: '2px solid #4caf50',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        ✅ עדכונים בזמן אמת מופעלים - תובנות חדשות יופיעו אוטומטית
      </div>
      
      {insights.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          border: '2px dashed #dee2e6',
          direction: 'rtl',
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '15px', color: '#2c3e50' }}>
            אין תובנות זמינות עדיין
          </div>
          <div style={{ fontSize: '18px', marginTop: '15px' }}>
            תובנות יופיעו כאן כאשר הן ייווצרו
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            fontSize: '18px', 
            color: '#2c3e50', 
            marginBottom: '20px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            מציג {insights.length} תובנות (החדשות ביותר קודם)
          </div>
          <ul style={{ listStyle: 'none', padding: 0, direction: 'rtl' }}>
            {insights.map((insight, index) => (
              <li 
                key={insight.id || insight.doc_id || index}
                style={{
                  padding: '30px',
                  marginBottom: '25px',
                  backgroundColor: index === 0 ? '#fff8e1' : '#ffffff',
                  border: index === 0 ? '3px solid #ff9800' : '2px solid #e0e0e0',
                  borderRadius: '15px',
                  boxShadow: index === 0 ? '0 8px 25px rgba(255, 152, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
                  direction: 'rtl',
                  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                }}
              >
                <div style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '500' }}>{formatTimestamp(insight.timestamp)}</span>
                  {index === 0 && (
                    <span style={{ 
                      backgroundColor: '#ff9800', 
                      color: '#fff', 
                      padding: '8px 12px', 
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      חדש
                    </span>
                  )}
                </div>
                
                {insight.title && (
                  <h2 style={{ 
                    fontSize: '28px', 
                    marginBottom: '25px', 
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {insight.title}
                  </h2>
                )}
                
                {renderInsightContent(insight)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App; 