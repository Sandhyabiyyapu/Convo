import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

/**
 * ThemeSelector Component - Theme switching dropdown interface
 * 
 * This component provides a dropdown menu for users to switch between different
 * UI themes. It displays theme options with visual previews and highlights
 * the currently active theme. The component integrates with the global theme
 * store to persist theme preferences.
 * 
 * @returns {JSX.Element} The theme selector dropdown with theme options and previews
 */
const ThemeSelector = () => {
  // Get current theme and theme setter function from global store
  const { theme, setTheme } = useThemeStore();

  return (
    // Dropdown container with end positioning
    <div className="dropdown dropdown-end">
      
      {/* DROPDOWN TRIGGER - Button that opens the dropdown */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>

      {/* DROPDOWN CONTENT - Theme options menu */}
      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 border border-base-content/10 max-h-80 overflow-y-auto"
      >
        {/* Container for theme options with spacing */}
        <div className="space-y-1">
          
          {/* Map through all available themes from constants */}
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
              w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
              ${
                theme === themeOption.name
                  ? "bg-primary/10 text-primary" // Active theme styling
                  : "hover:bg-base-content/5"    // Hover state styling
              }
            `}
              onClick={() => setTheme(themeOption.name)} // Set theme when clicked
            >
              {/* Theme icon */}
              <PaletteIcon className="size-4" />
              
              {/* Theme label/name */}
              <span className="text-sm font-medium">{themeOption.label}</span>
              
              {/* THEME PREVIEW COLORS - Visual color swatches */}
              <div className="ml-auto flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }} // Apply theme color
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;