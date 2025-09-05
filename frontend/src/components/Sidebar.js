import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const sidebarLinks = [
  { to: "/dashboard", icon: "fa-regular fa-house", label: "Dashboard" },
  { to: "/alerts", icon: "fa-solid fa-triangle-exclamation", label: "Alerts" },
  { to: "/verification", icon: "fa-regular fa-circle-check", label: "Verification" },
  { to: "/fraud-detection", icon: "fa-solid fa-shield-halved", label: "Fraud Detection" }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-brand">
        <i className="fas fa-user-shield brand-logo"></i>
        {!collapsed && <span>Securities<br />Fraud Prevention</span>}
      </div>
      <nav className="sidebar-links">
        {sidebarLinks.map(link => (
          <NavLink
            to={link.to}
            key={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            title={collapsed ? link.label : undefined}
            end
            style={{ textDecoration: 'none' }}
          >
            <div className="sidebar-link-pill">
              <i className={link.icon}></i>
              {!collapsed && <span className="sidebar-label">{link.label}</span>}
            </div>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-collapse-row">
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(x => !x)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`fas fa-angle-${collapsed ? "right" : "left"}`}></i>
        </button>
      </div>
    </aside>
  );
}
