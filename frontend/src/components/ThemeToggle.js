import React, { useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Make sure FontAwesome CSS is included

function ThemeToggle({ darkMode, setDarkMode }) {
  const inputRef = useRef();

  // Sync the checkbox state with darkMode prop
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.checked = darkMode;
    }
  }, [darkMode]);

  return (
    <div>
      <input
        type="checkbox"
        className="checkbox"
        id="theme-checkbox"
        ref={inputRef}
        onChange={() => setDarkMode(mode => !mode)}
        style={{ display: "none" }}
      />
      <label htmlFor="theme-checkbox" className="checkbox-label">
        <i className="fas fa-moon"></i>
        <i className="fas fa-sun"></i>
        <span className="ball"></span>
      </label>
    </div>
  );
}

export default ThemeToggle;
