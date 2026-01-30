import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const STORAGE_KEY = "theme"; // "dark" | "light"

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "dark" || saved === "light") return saved;

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    // الأفضل توحيد التطبيق على html + body (ليغطي أي CSS قديم)
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);

    // لو عندك CSS بيعتمد على class "dark" خليه كمان:
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isDark = theme === "dark";

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
