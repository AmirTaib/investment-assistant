import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { InsightsPage } from './pages/InsightsPage';

function App(): JSX.Element {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Auto-redirect to insights page */}
          <Route path="/" element={<Navigate to="/insights" replace />} />
          
          {/* Insights page */}
          <Route path="/insights" element={<InsightsPage />} />
          
          {/* Future pages can be added here */}
          {/* <Route path="/portfolio" element={<PortfolioPage />} /> */}
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
          
          {/* Fallback - redirect to insights */}
          <Route path="*" element={<Navigate to="/insights" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; 