"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  isVoiceEnabled: true,
  setIsVoiceEnabled: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // On mount, read persisted preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersDark = savedTheme !== null ? savedTheme === "dark" : true;
    setIsDark(prefersDark);

    const savedVoice = localStorage.getItem("portfolio-voice");
    const prefersVoice = savedVoice !== null ? savedVoice === "true" : true;
    setIsVoiceEnabled(prefersVoice);

    setMounted(true);
  }, []);

  // Apply / remove data-theme attribute on <html> whenever isDark changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  // Persist voice setting
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("portfolio-voice", isVoiceEnabled ? "true" : "false");
  }, [isVoiceEnabled, mounted]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isVoiceEnabled, setIsVoiceEnabled }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
