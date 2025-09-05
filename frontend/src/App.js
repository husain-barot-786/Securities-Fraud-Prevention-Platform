import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import AlertsPage from "./pages/AlertsPage";
import Dashboard from "./pages/Dashboard";
import VerificationTool from "./pages/VerificationTool";
import FraudDetection from "./pages/FraudDetection";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";
import "./styles/Dark-Theme-Toggle.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  return (
    <Router>
      <div className={`App app-layout${darkMode ? " dark" : ""}`}>
        <div className="theme-toggle-global">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/verification" element={<VerificationTool />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        {/* Global Toast container for the entire app */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
