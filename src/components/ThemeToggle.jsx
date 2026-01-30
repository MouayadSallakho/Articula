import React, { useContext } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import "./ThemeToggle.css";
import { ThemeContext } from "../context/ThemeContext"; // عدّل المسار حسب مشروعك

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      className={`themeToggle ${isDark ? "isDark" : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="ttTrack" aria-hidden="true">
        <span className="ttKnob" aria-hidden="true">
          {isDark ? <FiMoon /> : <FiSun />}
        </span>
      </span>
    </button>
  );
}
