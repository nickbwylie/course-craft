// src/styles/useTheme.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Try to get the user's preference from localStorage or system preference
const getInitialTheme = (): "light" | "dark" => {
  // Check localStorage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") {
    return "light";
  }

  // Default to dark
  return "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    getInitialTheme
  );
  const isDark = currentTheme === "dark";

  // Apply the theme class to the document element
  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Save the preference to localStorage
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme, isDark]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const storedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      // Only change if user hasn't set a preference
      if (!storedTheme) {
        setCurrentTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (theme: "light" | "dark") => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
