// src/myComponents/ThemeToggle.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTracking } from "@/hooks/useTracking";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "outline",
  size = "icon",
}) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  const { trackEvent } = useTracking();
  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Default to dark mode if no preference is stored or dark is stored
      setIsDark(true);
      document.documentElement.classList.add("dark");
      if (!storedTheme) {
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      trackEvent("theme_toggle", undefined, { theme: "dark" });
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      trackEvent("theme_toggle", undefined, { theme: "light" });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
        key={isDark ? "dark" : "light"}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
        }}
      >
        {isDark ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
