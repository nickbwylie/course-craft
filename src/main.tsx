import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ParallaxProvider } from "react-scroll-parallax";
import { ThemeProvider } from "./styles/useTheme.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ParallaxProvider>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </ParallaxProvider>
  </StrictMode>
);
