import React, { useState, useEffect } from "react";
import { fraudAPI } from "../services/api";
import { toast } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/FraudDetection.css";
import { useAlertNotifications } from "../hooks/useAlertNotifications";

const FraudDetection = () => {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState({ platform: "", message: "" });
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAlerts = async () => {
    const res = await fetch("http://localhost:8000/alerts/");
    return await res.json();
  };

  const fetchVerifications = async () => {
    const res = await fetch("http://localhost:8000/verification/status-updates");
    return await res.json();
  };

  useAlertNotifications(fetchAlerts, fetchVerifications, 10000);

  useEffect(() => {
    loadTips();
    const interval = setInterval(loadTips, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadTips = async () => {
    try {
      const res = await fraudAPI.getAllTips();
      setTips(res.data);
    } catch {
      setError("Failed to load fraud tips");
    }
  };

  const handleInputChange = (e) => {
    setNewTip({ ...newTip, [e.target.name]: e.target.value });
  };

  const addTip = async () => {
    setError(null);
    if (!newTip.platform || !newTip.message) {
      toast.info("Both platform and message are required!");
      return;
    }
    try {
      await fraudAPI.addTip(newTip);
      toast.success("Fraud tip added!");
      setNewTip({ platform: "", message: "" });
      loadTips();
    } catch {
      toast.error("Error adding fraud tip!");
    }
  };

  const isDemoTip = (plat) => (plat || "").toLowerCase() === "demo";

  const platformIcon = (plat) => {
    const lowerPlat = plat ? plat.toLowerCase() : "";
    if (lowerPlat.includes("twitter"))
      return <span className="fraud-tip-icon twitter"></span>;
    if (lowerPlat.includes("whatsapp"))
      return <span className="fraud-tip-icon whatsapp"></span>;
    if (lowerPlat.includes("telegram"))
      return <span className="fraud-tip-icon telegram"></span>;
    if (isDemoTip(plat))
      return (
        <span
          style={{
            color: "#fc8803",
            marginRight: "8px",
            fontWeight: "bold",
            fontSize: "1.08em",
            verticalAlign: "middle",
          }}
          title="Demo tip"
        >
          <i className="fas fa-bug"></i>
        </span>
      );
    return <i className="fas fa-bullhorn" style={{ color: "#e63946", marginRight: "8px" }} />;
  };

  const filteredTips = tips.filter(
    (tip) =>
      (tip.platform && tip.platform.toLowerCase().includes(search.toLowerCase())) ||
      (tip.message && tip.message.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fraud-page-container">
      <div className="fraud-card">
        <h1 className="fraud-title">
          <span role="img" aria-label="shield">
            🛡️
          </span>{" "}
          Fraud Detection &amp; Tips
        </h1>
        <div className="fraud-meta">
          <input
            type="text"
            className="fraud-search"
            placeholder="Search tips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="fraud-lock">
            <span role="img" aria-label="lock" style={{ marginRight: 4 }}>
              🔒
            </span>
            Only admins can add fraud tips
          </div>
        </div>
        {/* Add-tip form for admins */}
        {user && user.role === "admin" && (
          <div className="add-tip-form">
            <input
              type="text"
              name="platform"
              placeholder="Platform (e.g., Telegram)"
              value={newTip.platform}
              className="tip-input"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="message"
              placeholder="Fraud message"
              value={newTip.message}
              className="tip-input"
              onChange={handleInputChange}
            />
            <button className="action-btn" onClick={addTip}>
              Add Fraud Tip
            </button>
          </div>
        )}
        {/* Show error if any */}
        {error && <div className="error">{error}</div>}
        {/* Fraud tips cards */}
        <ul className="fraud-tip-list">
          {filteredTips.length ? (
            filteredTips.map((tip) => (
              <li
                key={tip.id ? tip.id : tip.message + tip.platform}
                className={`tip-card${isDemoTip(tip.platform) ? " tip-demo" : ""}`}
              >
                {platformIcon(tip.platform)}
                <strong>{isDemoTip(tip.platform) ? "Demo" : tip.platform}:</strong>
                <span style={{ marginLeft: "7px" }}>{tip.message}</span>
              </li>
            ))
          ) : (
            <li className="no-tips">No tips found for this search.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FraudDetection;
