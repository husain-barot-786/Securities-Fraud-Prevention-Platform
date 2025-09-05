import React, { useEffect, useState } from "react";
import { fraudAPI } from "../services/api";
import { useAlertNotifications } from "../hooks/useAlertNotifications";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [fraudTips, setFraudTips] = useState([]);
  const [mergedRecentAlerts, setMergedRecentAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const fetchAlerts = async () => {
    const res = await fetch("http://localhost:8000/alerts/");
    return await res.json();
  };

  const fetchVerifications = async () => {
    const res = await fetch("http://localhost:8000/verification/status-updates");
    return await res.json();
  };

  useAlertNotifications(fetchAlerts, fetchVerifications, 10000);

  // Refetch alerts/verifications for dashboard + audit log (real-time update)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alerts, verifications, tipsRes] = await Promise.all([
          fetchAlerts(),
          fetchVerifications(),
          fraudAPI.getAllTips(),
        ]);
        setFraudTips(tipsRes.data);

        const alertsMarked = alerts.map((a) => ({ ...a, _type: "alert" }));
        const verifMarked = verifications.map((v) => ({
          ...v,
          _type: "verification",
        }));

        const combined = [...alertsMarked, ...verifMarked];
        combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMergedRecentAlerts(combined.slice(0, 5));
      } catch (e) {
        setError("Failed to load alerts and verifications.");
        console.error(e);
      }
    };

    // Run initial and every 10 seconds for live update
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (id) => {
    try {
      await fetch(`http://localhost:8000/alerts/${id}/resolve`, {
        method: "PATCH",
      });
      // Refresh for instant UI update
      const [alerts, verifications] = await Promise.all([fetchAlerts(), fetchVerifications()]);
      const alertsMarked = alerts.map((a) => ({ ...a, _type: "alert" }));
      const verifMarked = verifications.map((v) => ({ ...v, _type: "verification" }));
      const combined = [...alertsMarked, ...verifMarked];
      combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMergedRecentAlerts(combined.slice(0, 5));
    } catch {
      // Error toast is handled globally by hook or can add here if needed
    }
  };

  const chartData = Object.entries(
    fraudTips.reduce((acc, tip) => {
      acc[tip.platform] = (acc[tip.platform] || 0) + 1;
      return acc;
    }, {})
  ).map(([platform, count]) => ({ platform, count }));

  const addDemoData = async () => {
    try {
      await fraudAPI.addTip({
        platform: "Demo",
        message: "Please review this report for suspicious content.",
      });
      // Refresh for live update right away
      const [alerts, verifications] = await Promise.all([fetchAlerts(), fetchVerifications()]);
      const alertsMarked = alerts.map((a) => ({ ...a, _type: "alert" }));
      const verifMarked = verifications.map((v) => ({ ...v, _type: "verification" }));
      const combined = [...alertsMarked, ...verifMarked];
      combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setMergedRecentAlerts(combined.slice(0, 5));
    } catch {
      // Error toast handled elsewhere
    }
  };

  const toggleAuditLog = () => setShowAuditLog((prev) => !prev);

  return (
    <div className="dashboard-main">
      <h1 className="dashboard-title">Fraud Alerts Dashboard</h1>
      {error && <p className="dashboard-error">{error}</p>}

      <div className="dashboard-actions">
        <button onClick={addDemoData} className="dashboard-btn">
          <i className="fas fa-bug"></i> Demo Mode: Add Sample Data
        </button>
        <button onClick={toggleAuditLog} className="dashboard-btn">
          <i className="fas fa-history"></i> View Audit Log
        </button>
      </div>

      {showAuditLog && (
        <section className="audit-log-panel">
          <h2>Audit Log (Recent Alerts)</h2>
          <button onClick={toggleAuditLog} className="dashboard-btn close-btn">
            Close
          </button>
          <ul>
            {mergedRecentAlerts.map((item, idx) => (
              <li key={idx}>
                <strong>{item.timestamp}</strong> -{" "}
                {item._type === "alert"
                  ? `${item.alert_type}: ${item.message}`
                  : `Verification: User ${item.username} status changed ${item.status}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="alerts-summary">
        <h2 className="dashboard-subheading">
          Recent Alerts ({mergedRecentAlerts.length})
        </h2>
        <ul className="dashboard-recent-alerts">
          {mergedRecentAlerts.map((item, idx) => (
            <li
              key={item._type === "alert" ? item.id : `${item.user_id}_${idx}`}
              className="dashboard-alert-card"
            >
              <span className="dashboard-alert-icon">
                <i
                  className={`fas ${
                    item._type === "alert"
                      ? item.alert_type === "FraudTip"
                        ? "fa-exclamation-triangle"
                        : "fa-bullhorn"
                      : "fa-user-check"
                  }`}
                  style={{
                    color:
                      item._type === "alert"
                        ? item.alert_type === "FraudTip"
                          ? "#e63946"
                          : "#256eb"
                        : "#008FF0",
                  }}
                />
              </span>
              <div>
                {item._type === "alert" ? (
                  <>
                    <strong>{item.alert_type}</strong>: {item.message}
                    <br />
                    <span>
                      Status: <b>{item.status}</b>
                    </span>
                    {item.status !== "resolved" && (
                      <button
                        className="dashboard-btn dashboard-alert-action"
                        onClick={() => resolveAlert(item.id)}
                        style={{
                          marginLeft: "18px",
                          fontSize: "0.97em",
                          background: "#e2e8f0",
                          color: "#256eb",
                          borderRadius: "4px",
                          padding: "2px 8px",
                          border: "1px solid #e2e8f0",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                      >
                        Mark as resolved
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <strong>Verification</strong>: User{" "}
                    <strong>{item.username}</strong> status{" "}
                    <em>{item.status}</em>
                  </>
                )}
                <br />
                <small>{item.timestamp}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="fraud-chart">
        <h2 className="dashboard-subheading">Fraud Tips By Platform</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="platform" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Dashboard;
