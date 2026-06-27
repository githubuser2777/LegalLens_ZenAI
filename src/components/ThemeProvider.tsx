"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UIStyle = "modern" | "classic";

interface ThemeContextType {
  uiStyle: UIStyle;
  setUiStyle: (style: UIStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [uiStyle, setUiStyleState] = useState<UIStyle>("modern");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("uiStyle") as UIStyle;
    if (stored === "classic" || stored === "modern") {
      setUiStyleState(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("uiStyle", uiStyle);
    if (uiStyle === "classic") {
      document.body.classList.add("theme-classic");
    } else {
      document.body.classList.remove("theme-classic");
    }
  }, [uiStyle, mounted]);

  const setUiStyle = (style: UIStyle) => {
    setUiStyleState(style);
  };

  return (
    <ThemeContext.Provider value={{ uiStyle, setUiStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
