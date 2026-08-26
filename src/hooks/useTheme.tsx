import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'sand' | 'deep-blue' | 'deep-night' | 'red-light';

const VALID_THEMES: Theme[] = ['sand', 'deep-blue', 'deep-night', 'red-light'];

const THEME_COLORS: Record<Theme, string> = {
  'sand': '#F8F7F4',
  'deep-blue': '#0B1120',
  'deep-night': '#09090B',
  'red-light': '#FAF7F7'
};

const getStoredTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('clay_theme') || localStorage.getItem('app_theme') || localStorage.getItem('theme');
    if (saved && VALID_THEMES.includes(saved as Theme)) {
      return saved as Theme;
    }
  } catch (e) {
    console.warn('Unable to access localStorage for theme preference', e);
  }
  return 'sand';
};

const getStoredHighContrast = (): boolean => {
  try {
    const saved = localStorage.getItem('clay_high_contrast') || localStorage.getItem('app_high_contrast');
    return saved === 'true';
  } catch (e) {
    return false;
  }
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const [highContrast, setHighContrastState] = useState<boolean>(() => getStoredHighContrast());

  const applyThemeToDOM = useCallback((currentTheme: Theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);

    // Update mobile browser status bar/theme color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_COLORS[currentTheme] || '#F5F2ED');
    }
  }, []);

  const applyHighContrastToDOM = useCallback((isHighContrast: boolean) => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.setAttribute('data-high-contrast', 'true');
      root.classList.add('high-contrast');
    } else {
      root.removeAttribute('data-high-contrast');
      root.classList.remove('high-contrast');
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    if (!VALID_THEMES.includes(newTheme)) return;
    
    setThemeState(newTheme);
    try {
      localStorage.setItem('clay_theme', newTheme);
      localStorage.setItem('app_theme', newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e);
    }

    applyThemeToDOM(newTheme);
    window.dispatchEvent(new CustomEvent('clay_theme_changed', { detail: newTheme }));
  }, [applyThemeToDOM]);

  const setHighContrast = useCallback((enabled: boolean) => {
    setHighContrastState(enabled);
    try {
      localStorage.setItem('clay_high_contrast', String(enabled));
      localStorage.setItem('app_high_contrast', String(enabled));
    } catch (e) {
      console.warn('Failed to save high contrast in localStorage', e);
    }

    applyHighContrastToDOM(enabled);
    window.dispatchEvent(new CustomEvent('clay_high_contrast_changed', { detail: enabled }));
  }, [applyHighContrastToDOM]);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(!highContrast);
  }, [highContrast, setHighContrast]);

  // Initial sync and listener setup
  useEffect(() => {
    applyThemeToDOM(theme);
    applyHighContrastToDOM(highContrast);

    const handleStorage = (e: StorageEvent) => {
      if ((e.key === 'clay_theme' || e.key === 'app_theme' || e.key === 'theme') && e.newValue) {
        if (VALID_THEMES.includes(e.newValue as Theme)) {
          const updatedTheme = e.newValue as Theme;
          setThemeState(updatedTheme);
          applyThemeToDOM(updatedTheme);
        }
      }
      if ((e.key === 'clay_high_contrast' || e.key === 'app_high_contrast') && e.newValue !== null) {
        const updatedHC = e.newValue === 'true';
        setHighContrastState(updatedHC);
        applyHighContrastToDOM(updatedHC);
      }
    };

    const handleThemeEvent = (e: CustomEvent<Theme>) => {
      if (e.detail && VALID_THEMES.includes(e.detail) && e.detail !== theme) {
        setThemeState(e.detail);
        applyThemeToDOM(e.detail);
      }
    };

    const handleHighContrastEvent = (e: CustomEvent<boolean>) => {
      if (typeof e.detail === 'boolean' && e.detail !== highContrast) {
        setHighContrastState(e.detail);
        applyHighContrastToDOM(e.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('clay_theme_changed' as any, handleThemeEvent);
    window.addEventListener('clay_high_contrast_changed' as any, handleHighContrastEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('clay_theme_changed' as any, handleThemeEvent);
      window.removeEventListener('clay_high_contrast_changed' as any, handleHighContrastEvent);
    };
  }, [theme, highContrast, applyThemeToDOM, applyHighContrastToDOM]);

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


