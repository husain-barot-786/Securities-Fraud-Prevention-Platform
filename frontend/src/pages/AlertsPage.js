import React, { useEffect, useState } from "react";
import { alertsAPI } from "../services/api";
import { useAlertNotifications } from "../hooks/useAlertNotifications";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/AlertsPage.css";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);

  const fetchAlerts = async () => {
    const res = await alertsAPI.getAllAlerts();
    return res.data;
  };

  const fetchVerifications = async () => {
    const res = await fetch("http://localhost:8000/verification/status-updates");
    return await res.json();
  };

  useAlertNotifications(fetchAlerts, fetchVerifications, 10000);

  // Fetch visible data on load and polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, verifRes] = await Promise.all([
          alertsAPI.getAllAlerts(),
          fetch("http://localhost:8000/verification/status-updates"),
        ]);
        setAlerts(alertsRes.data);
        setVerifications(await verifRes.json());
      } catch (err) {
        setError("Failed to load alerts");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Mark alert as resolved
  const resolveAlert = async (alertId) => {
    try {
      await fetch(`http://localhost:8000/alerts/${alertId}/resolve`, {
        method: "PATCH",
      });
      setRefresh((r) => !r); // trigger page refresh
    } catch {
      setError("Failed to mark alert as resolved.");
    }
  };

  // Merge alerts and verifications by timestamp (descending)
  const mergedItems = [
    ...alerts.map((a) => ({
      ...a,
      type: "alert",
    })),
    ...verifications.map((v) => ({
      ...v,
      type: "verification",
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Filter by search for both alerts and verifications
  const filteredItems = mergedItems.filter((item) => {
    if (item.type === "alert") {
      return (
        (item.alert_type && item.alert_type.toLowerCase().includes(search.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(search.toLowerCase())) ||
        (item.message && item.message.toLowerCase().includes(search.toLowerCase())) ||
        (item.timestamp && item.timestamp.toLowerCase().includes(search.toLowerCase()))
      );
    }
    // For verification type
    return (
      (item.username && item.username.toLowerCase().includes(search.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(search.toLowerCase())) ||
      (item.timestamp && item.timestamp.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Helper for date-time formatting
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="alerts-wrap">
      <h1 className="alerts-header">Alerts</h1>
      <div className="alerts-search-row">
        <input
          className="alerts-search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="alerts-search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>
      {error && <p className="alerts-error">{error}</p>}
      <div className="alerts-list">
        {filteredItems.length ? (
          filteredItems.map((item, idx) => (
            <div className="alert-card" key={item.type === "alert" ? item.id : `${item.user_id}_${item.timestamp}`}>
              <div className="alert-date">{formatTimestamp(item.timestamp)}</div>
              <div className="alert-title">
                {item.type === "alert" ? (
                  <>
                    <i
                      className={`fas ${item.alert_type === "FraudTip" ? "fa-exclamation-triangle" : "fa-bullhorn"}`}
                      style={{
                        color: item.alert_type === "FraudTip" ? "#e63946" : "#2563eb",
                        marginRight: "10px",
                      }}
                    />
                    <strong>
                      {item.alert_type === "FraudTip" ? "Fraud Tip" : "Announcement"}
                    </strong>
                    {" "}
                    <span className="alert-status">| {item.status}</span>
                  </>
                ) : (
                  <>
                    <i
                      className="fas fa-user-check"
                      style={{ color: "#008ff0", marginRight: "10px" }}
                    />
                    <strong>Verification</strong>{" "}
                    <span className="alert-status">
                      | {item.status}
                    </span>
                  </>
                )}
              </div>
              <div className="alert-message">
                {item.type === "alert"
                  ? (
                      <>
                        {item.message}
                        {item.alert_type === "FraudTip" && item.status === "active" && (
                          <button
                            className="dashboard-btn dashboard-alert-action"
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
                              marginTop: "8px",
                            }}
                            onClick={() => resolveAlert(item.id)}
                          >
                            Mark as resolved
                          </button>
                        )}
                      </>
                  )
                  : (
                    <>
                      User <strong>{item.username}</strong> status <em>{item.status}</em>
                    </>
                  )
                }
              </div>
            </div>
          ))
        ) : (
          <div className="alert-card no-alerts">No alerts found for your search.</div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
