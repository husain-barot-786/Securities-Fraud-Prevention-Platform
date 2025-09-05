import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: BarChart3 },
    { path: '/alerts', name: 'Alerts', icon: AlertTriangle },
    { path: '/verification', name: 'Verification', icon: CheckCircle },
    { path: '/fraud-detection', name: 'Fraud Detection', icon: Shield },
  ];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Shield className="nav-logo" />
        <span>Securities Fraud Prevention</span>
      </div>
      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
