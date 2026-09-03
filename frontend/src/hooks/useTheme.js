import { useEffect, useState } from 'react';

// Accent color palette: name, label, and CSS variable values
const ACCENT_PALETTE = [
  {
    name: 'teal',
    label: 'Teal',
    light: { accent: '#0d9488', hover: '#0f766e', dark: '#134e4a', light: '#ccfbf1' },
    dark: { accent: '#14b8a6', hover: '#0d9488', dark: '#134e4a', light: '#ccfbf1' },
  },
  {
    name: 'blue',
    label: 'Blue',
    light: { accent: '#0284c7', hover: '#0369a1', dark: '#0c4a6e', light: '#e0f2fe' },
    dark: { accent: '#38bdf8', hover: '#0284c7', dark: '#0c4a6e', light: '#e0f2fe' },
  },
  {
    name: 'purple',
    label: 'Purple',
    light: { accent: '#9333ea', hover: '#7e22ce', dark: '#581c87', light: '#f3e8ff' },
    dark: { accent: '#d8b4fe', hover: '#c084fc', dark: '#581c87', light: '#f3e8ff' },
  },
  {
    name: 'emerald',
    label: 'Emerald',
    light: { accent: '#059669', hover: '#047857', dark: '#064e3b', light: '#d1fae5' },
    dark: { accent: '#6ee7b7', hover: '#a7f3d0', dark: '#064e3b', light: '#d1fae5' },
  },
  {
    name: 'rose',
    label: 'Rose',
    light: { accent: '#e11d48', hover: '#be185d', dark: '#831843', light: '#ffe4e6' },
    dark: { accent: '#fb7185', hover: '#f43f5e', dark: '#831843', light: '#ffe4e6' },
  },
  {
    name: 'amber',
    label: 'Amber',
    light: { accent: '#d97706', hover: '#b45309', dark: '#78350f', light: '#fef3c7' },
    dark: { accent: '#fbbf24', hover: '#f59e0b', dark: '#78350f', light: '#fef3c7' },
  },
];

const STORAGE_THEME_KEY = 'meditravel_theme';
const STORAGE_ACCENT_KEY = 'meditravel_accent';

/**
 * useTheme hook
 * Manages theme (light/dark) and accent color
 * Persists to localStorage and respects system preference
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;

    // Default to light theme
    return 'light';
  });

  const [accentColor, setAccentColor] = useState(() => {
    const stored = localStorage.getItem(STORAGE_ACCENT_KEY);
    return stored || 'teal';
  });

  // Apply theme to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Apply accent color CSS variables
  useEffect(() => {
    const accentOption = ACCENT_PALETTE.find((opt) => opt.name === accentColor) || ACCENT_PALETTE[0];
    const colorVars = theme === 'dark' ? accentOption.dark : accentOption.light;

    document.documentElement.style.setProperty('--color-accent', colorVars.accent);
    document.documentElement.style.setProperty('--color-accent-hover', colorVars.hover);
    document.documentElement.style.setProperty('--color-accent-dark', colorVars.dark);
    document.documentElement.style.setProperty('--color-accent-light', colorVars.light);

    localStorage.setItem(STORAGE_ACCENT_KEY, accentColor);
  }, [accentColor, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
    accentPalette: ACCENT_PALETTE,
  };
}
