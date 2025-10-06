"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export type ThemeColor = "black" | "red";

export type Theme = { 
  bg: string; 
  text: string; 
  gradient?: string;
  name?: ThemeColor | "custom";
};

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme | ThemeColor) => void;
  switchTheme: (themeName: ThemeColor) => void;
  themes: Record<ThemeColor, Theme>;
  currentThemeName: ThemeColor | "custom";
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Define themes outside component to avoid recreation
const THEMES: Record<ThemeColor, Theme> = {
  black: {
    bg: "#0a0a0a",
    text: "#ffffff",
    gradient: "from-gray-900/90 to-gray-800/90",
    name: "black"
  },
  red: {
    bg: "#9b1b1b",
    text: "#ffffff",
    gradient: "from-red-900/90 to-red-700/90",
    name: "red"
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Client-side only check
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('theme-color');
        if (saved && THEMES[saved as ThemeColor]) {
          return THEMES[saved as ThemeColor];
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    }
    return THEMES.black;
  });

  const setTheme = (newTheme: Theme | ThemeColor) => {
    const selectedTheme = typeof newTheme === 'string' ? THEMES[newTheme] : newTheme;
    
    setThemeState(selectedTheme);
    
    // Persist to localStorage
    try {
      if (typeof newTheme === 'string') {
        localStorage.setItem('theme-color', newTheme);
      } else {
        localStorage.setItem('theme-color', 'custom');
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const switchTheme = (themeName: ThemeColor) => {
    setTheme(themeName);
  };

  const resetToDefault = () => {
    setTheme('black');
  };

  const currentThemeName = useMemo((): ThemeColor | "custom" => {
    if (theme.name && theme.name in THEMES) {
      return theme.name as ThemeColor;
    }
    return "custom";
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    switchTheme,
    themes: THEMES,
    currentThemeName,
    resetToDefault,
  }), [theme, currentThemeName]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};