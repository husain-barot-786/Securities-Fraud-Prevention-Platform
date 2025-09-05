import React, { useState } from "react";
import { toast } from "react-toastify";
import { fraudRulesAPI, alertsAPI } from "../services/api";
import { useAlertNotifications } from "../hooks/useAlertNotifications";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/VerificationTool.css";

const VerificationTool = () => {
  const [form, setForm] = useState({ platform: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // --- THESE FETCH THE SAME ENDPOINTS AS DASHBOARD ---
  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:8000/alerts/");
      return await res.json();
    } catch {
      return [];
    }
  };

  const fetchVerifications = async () => {
    try {
      const res = await fetch("http://localhost:8000/verification/status-updates");
      return await res.json();
    } catch {
      return [];
    }
  };

  useAlertNotifications(fetchAlerts, fetchVerifications, 10000);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!form.platform || !form.message) {
      toast.info("Platform and message are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fraudRulesAPI.testMessage(form);
      setResult(response.data);
    } catch (error) {
      toast.error("Error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h1 className="verification-title">
          <i className="fas fa-search"></i> Verification Tool
        </h1>
        <form className="verification-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="input-group">
            <label htmlFor="platform">Platform</label>
            <input
              id="platform"
              name="platform"
              type="text"
              value={form.platform}
              placeholder="e.g., Telegram, WhatsApp, Twitter"
              className="veri-input"
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              placeholder="Enter message text here"
              className="veri-input"
              onChange={handleChange}
              style={{ resize: "vertical", minHeight: 65 }}
            />
          </div>
          <button type="submit" className="veri-btn" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-shield-alt"></i> Verify</>}
          </button>
        </form>
        {result && (
          <div className={result.flagged ? "veri-error" : "veri-info"}>
            {result.flagged ? (
              <>
                <i className="fas fa-exclamation-triangle"></i> Fraud detected.
                <br />
                <small>{result.reason}</small>
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i> No fraud detected.
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationTool;
