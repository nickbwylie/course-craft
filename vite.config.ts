import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import MillionLint from "@million/lint";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
