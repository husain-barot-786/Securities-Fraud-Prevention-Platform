import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ darkMode }) => {
  return (
    <nav className="navbar" style={darkMode ? { background: '#222' } : {}}>
      <div className="nav-brand">
        <i className="fas fa-shield-alt" style={{ marginRight: 8 }}></i>
        Securities Fraud Prevention
      </div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-chart-bar"></i> Dashboard
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-exclamation-triangle"></i> Alerts
        </NavLink>
        <NavLink to="/verification" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-check-circle"></i> Verification
        </NavLink>
        <NavLink to="/fraud-detection" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fas fa-search"></i> Fraud Detection
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
