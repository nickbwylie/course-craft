/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // This is the only change needed if not already present
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Define your custom theme colors for Tailwind
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary))",
          light: "rgb(var(--color-primary-light))",
          dark: "rgb(var(--color-primary-dark))",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary))",
          light: "rgb(var(--color-secondary-light))",
          dark: "rgb(var(--color-secondary-dark))",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent))",
          light: "rgb(var(--color-accent-light))",
          dark: "rgb(var(--color-accent-dark))",
        },
        notification: {
          DEFAULT: "rgb(var(--color-notification, 30 41 59))",
          hover: "rgb(var(--color-notification-hover, 41 55 74))",
          border: "rgb(var(--color-notification-border, 51 65 85))",
          text: "rgb(var(--color-notification-text, 226 232 240))",
        },
      },
      backgroundColor: {
        card: "rgb(var(--color-card))",
        popover: "rgb(var(--color-popover))",
      },
      textColor: {
        card: "rgb(var(--color-card-foreground))",
        popover: "rgb(var(--color-popover-foreground))",
      },
      borderColor: {
        DEFAULT: "rgb(var(--color-border))",
        input: "rgb(var(--color-input))",
      },
    },
  },
  fontFamily: {
    sans: ["Inter", "sans-serif"],
  },
  plugins: [require("tailwindcss-animate")],
};
