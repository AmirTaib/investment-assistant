export interface KeyEvent {
  event: string;
  importance: string;
  impact: string;
}

export interface MarketOverview {
  summary: string;
  sentiment: 'חיובי' | 'שלילי' | 'ניטרלי';
  key_events: KeyEvent[];
  trending_sectors: string[];
  action_items: string[];
}

export interface Recommendation {
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
  catalyst: string;
}

export interface SectorAnalysis {
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

export interface Alert {
  type: 'רווחים' | 'חדשות' | 'טכני';
  symbol: string;
  message: string;
  priority: 'גבוה' | 'בינוני' | 'נמוך';
  action_required: string;
  urgency: 'דחוף' | 'בינוני' | 'לא דחוף';
  immediate_action: string;
}

export interface RiskManagement {
  current_risk: 'גבוה' | 'בינוני' | 'נמוך';
  risk_type: string;
  explanation: string;
  immediate_actions: string[];
  stop_loss_levels: string[];
  hedging_strategies: string[];
}

export interface Insight {
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