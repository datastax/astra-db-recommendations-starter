'use client';

import { useCallback, useEffect, useState } from "react";

export const useThemeDetector = () => {
  const darkThemeMq = typeof window !== 'undefined' ? window.matchMedia("(prefers-color-scheme: dark)") : undefined;

  const getCurrentTheme = () => darkThemeMq?.matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

  const mqListener = ((e: MediaQueryListEvent) => {
    setIsDarkTheme(e.matches);
  });

  useEffect(() => {
    if (darkThemeMq) {
      darkThemeMq.addEventListener("change", mqListener);
      return () => darkThemeMq.removeEventListener("change", mqListener);
    }
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  const toggleTheme = useCallback(() => setIsDarkTheme(prev => !prev), []);

  return {
    isDarkTheme,
    toggleTheme,
  };
}