import React, { useEffect, useState } from "react";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const ALERT_LIGHT = "#111";
  const ALERT_DARK = "#F6F6F7";

  useEffect(() => {
    const checkDark = () => setIsDarkMode(document.body.classList.contains("dark"));
    checkDark();
    window.addEventListener("storage", checkDark);
    window.addEventListener("DOMContentLoaded", checkDark);
    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, { attributes: true });
    return () => {
      window.removeEventListener("storage", checkDark);
      window.removeEventListener("DOMContentLoaded", checkDark);
      observer.disconnect();
    };
  }, []);

  // Fetch alerts and verification updates every 10s
  useEffect(() => {
    const fetchAlerts = () => {
      Promise.all([
        fetch("http://localhost:8000/alerts/").then((res) => res.json()),
        fetch("http://localhost:8000/verification/status-updates").then((res) =>
          res.json()
        ),
      ]).then(([alertData, verificationData]) => {
        const alertsArr = alertData.map((a) => ({ ...a, _type: "alert" }));
        const verificationArr = verificationData.map((v) => ({
          ...v,
          _type: "verification",
        }));
        const merged = [...alertsArr, ...verificationArr];
        merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAlerts(merged);
      });
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Real-Time Fraud and Verification Notifications</h2>
      {alerts.length === 0 ? (
        <p style={{ color: "gray", marginTop: "2em" }}>
          (No alerts or verifications yet)
        </p>
      ) : (
        <ul>
          {alerts.map((item, idx) => {
            const textColor = isDarkMode
              ? ALERT_DARK
              : ALERT_LIGHT;

            if (item._type === "alert") {
              return (
                <li key={`alert-${item.id ?? idx}`} style={{ color: textColor }}>
                  <strong>{item.alert_type}</strong>: {item.message}{" "}
                  {item.timestamp && <span>({item.timestamp})</span>}
                </li>
              );
            } else if (item._type === "verification") {
              return (
                <li
                  key={`verif-${item.user_id ?? idx}`}
                  style={{ color: textColor }}
                >
                  <strong>Verification</strong>: User{" "}
                  <strong>{item.username}</strong> status{" "}
                  <em>{item.status}</em>{" "}
                  {item.timestamp && <span>({item.timestamp})</span>}
                </li>
              );
            } else {
              return (
                <li key={idx} style={{ color: textColor }}>
                  {item.message || "Unknown notification"}
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
}

export default AlertsPage;
