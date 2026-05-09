import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Weather from './pages/AgriWeatherEthiopia.jsx';
import Profile from './pages/Profile.jsx';
import History from './pages/History.jsx';
import MainDashboard from './components/DashboardPage-components/MainDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import Scan from './pages/Scan.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MainDashboard />} />
          {/* Redirect bare /dashboard/scan to disease */}
          <Route path="scan" element={<Navigate to="scan/disease" replace />} />
          {/* Single Scan component handles types via URL param */}
          <Route path="scan/:type" element={<Scan />} />
          <Route path="weather" element={<Weather />} />
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
