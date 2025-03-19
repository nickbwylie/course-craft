/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // This is the only change needed if not already present
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Keep all your existing theme configuration here
      // No changes needed to your existing theme settings
      // fontFamily: {
      //   sans: ["Roboto Mono", "monospace"], // As your default font
      //   // OR you can add it as a specific font class
      //   mono: ["Roboto Mono", "monospace"],
      // },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
