import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Weather from './pages/Weather.jsx';
import Profile from './pages/Profile.jsx';
import History from './pages/History.jsx';
import MainDashboard from './components/DashboardPage-components/mainDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Scan from './pages/Scan.jsx';
import AgriVitaAuth from './pages/AgriVitaAuth.jsx';
import AgriProfit from './pages/AgriProfit.jsx';
import FertilizerExpert from './pages/fertilizer_expert.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AgriVitaAuth />} />

        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MainDashboard />} />
          {/* Redirect bare /dashboard/scan to disease */}
          <Route path="scan" element={<Navigate to="scan/disease" replace />} />
          {/* Single Scan component handles types via URL param */}
          <Route path="scan/:type" element={<Scan />} />
          <Route path="weather" element={<Weather />} />
          <Route path="profit" element={<AgriProfit />} />
          <Route path="fertilizer" element={<FertilizerExpert />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
