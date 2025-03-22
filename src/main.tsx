import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/theme.css";
import App from "./App.tsx";
import { ParallaxProvider } from "react-scroll-parallax";
import { ThemeProvider } from "./styles/useTheme.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CoursesActivityProvider } from "./contexts/CoursesActivityContext.tsx";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ParallaxProvider>
      <ThemeProvider>
        <AuthProvider>
          <CoursesActivityProvider>
            <App />
            <Analytics />
            <SpeedInsights />
          </CoursesActivityProvider>
          <Toaster />
          <SonnerToaster />
        </AuthProvider>
      </ThemeProvider>
    </ParallaxProvider>
  </StrictMode>
);
