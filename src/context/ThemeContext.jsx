import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext();

export const THEMES = [
  {
    id: "dark",
    label: "Dark",
    icon: "🌙",
    description: "Classic dark mode",
    mode: "dark",
    preview: ["#020617", "#0f172a", "#3b82f6"],
  },
  {
    id: "light",
    label: "Light",
    icon: "☀️",
    description: "Clean light mode",
    mode: "light",
    preview: ["#f8fafc", "#ffffff", "#3b82f6"],
  },
  {
    id: "midnight",
    label: "Midnight",
    icon: "🌌",
    description: "Deep blue night",
    mode: "dark",
    preview: ["#0a0e1a", "#111827", "#6366f1"],
  },
  {
    id: "forest",
    label: "Forest",
    icon: "🌿",
    description: "Natural green tones",
    mode: "dark",
    preview: ["#0d1a0f", "#1a2e1c", "#22c55e"],
  },
  {
    id: "sunset",
    label: "Sunset",
    icon: "🌅",
    description: "Warm orange vibes",
    mode: "dark",
    preview: ["#1a0a00", "#2d1506", "#f97316"],
  },
  {
    id: "ocean",
    label: "Ocean",
    icon: "🌊",
    description: "Deep sea blues",
    mode: "dark",
    preview: ["#000d1a", "#001f3d", "#06b6d4"],
  },
  {
    id: "glass",
    label: "Glass",
    icon: "🪟",
    description: "Frosted light glass",
    mode: "light",
    preview: ["#f5f3ff", "#ffffff", "#a855f7"],
  },
  {
    id: "sky",
    label: "Sky",
    icon: "🌤️",
    description: "Soft sky blue",
    mode: "light",
    preview: ["#eff6ff", "#ffffff", "#0ea5e9"],
  },
  {
    id: "mint",
    label: "Mint",
    icon: "🌱",
    description: "Fresh mint green",
    mode: "light",
    preview: ["#f0fdf4", "#ffffff", "#22c55e"],
  },
  {
    id: "blossom",
    label: "Blossom",
    icon: "🌸",
    description: "Soft pink blossom",
    mode: "light",
    preview: ["#fdf2f8", "#ffffff", "#ec4899"],
  },
];

const applyTheme = (themeId) => {
  const root = document.documentElement;

  // Remove all theme classes
  THEMES.forEach((t) => root.classList.remove(`theme-${t.id}`));

  // Add current theme class
  root.classList.add(`theme-${themeId}`);

  // Handle dark/light base class for Tailwind based on the theme's mode
  const themeObj = THEMES.find((t) => t.id === themeId);
  if (themeObj?.mode === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("verixa_theme") || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const setThemeById = (themeId) => {
    setTheme(themeId);
    localStorage.setItem("verixa_theme", themeId);
    applyTheme(themeId);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeById(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeById,
    isDark: theme !== "light",
    themes: THEMES,
    currentTheme: THEMES.find((t) => t.id === theme) || THEMES[0],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
