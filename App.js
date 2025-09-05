import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import VerificationTool from './pages/VerificationTool';
import AlertsPage from './pages/AlertsPage';
import FraudDetection from './pages/FraudDetection';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verification" element={<VerificationTool />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
