import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'sand' | 'deep-blue' | 'deep-night' | 'red-light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('app_theme');
    return (saved === 'deep-blue' || saved === 'deep-night' || saved === 'red-light' ? saved : 'sand') as Theme;
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('app_high_contrast') === 'true';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem('app_high_contrast', String(enabled));
    window.dispatchEvent(new CustomEvent('clay_high_contrast_changed', { detail: enabled }));
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  useEffect(() => {
    // Apply theme to html document
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply high-contrast attribute to html document
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute('data-high-contrast', 'true');
      root.classList.add('high-contrast');
    } else {
      root.removeAttribute('data-high-contrast');
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, highContrast, setHighContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

