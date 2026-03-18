import React, { createContext, useState, useEffect } from "react";
export const HeaderContext = createContext(null);

export const HeaderProvider = ({ children }) => {
  //managing global state for active component
  const [selected, setSelected] = useState("dashboard");

  // Theme management
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <HeaderContext.Provider value={{ selected, setSelected, theme, toggleTheme }}>
      {children}
    </HeaderContext.Provider>
  );
};
