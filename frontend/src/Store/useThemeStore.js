import { create } from "zustand";

/**
 * useThemeStore - Global theme state management using Zustand
 * 
 * This store manages the application's theme state globally. It provides:
 * - Current theme value
 * - Function to change themes
 * - Automatic persistence to localStorage
 * - Default theme fallback
 * 
 * Zustand is chosen for its simplicity and minimal boilerplate compared to Redux.
 * The store automatically persists theme preferences across browser sessions.
 */
export const useThemeStore = create((set) => ({
  // Current theme value - loads from localStorage or defaults to "coffee"
  theme: localStorage.getItem("streamify-theme") || "coffee",
  
  // Function to update the theme
  // This function both updates the store state and persists to localStorage
  setTheme: (theme) => {
    // Save theme preference to localStorage for persistence across sessions
    localStorage.setItem("streamify-theme", theme);
    
    // Update the store state to trigger re-renders in components
    set({ theme });
  },
}));