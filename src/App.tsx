import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import CreateCourse from "./pages/CreateCourse";
import ViewCourse from "./pages/ViewCourse";
import LandingPage from "./pages/LandingPage";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import { useMemo } from "react";
import LibraryPage from "./pages/LibraryPage";
import { ThemeProvider } from "./styles/useTheme"; // Import ThemeProvider
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

export default function App() {
  return useMemo(
    () => (
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Home Page Route */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Routes that require the side navigation */}
            <Route element={<Layout />}>
              <Route
                path="course/:id"
                element={<ViewCourse key={window.location.pathname} />}
              />

              {/* Explore Page Route */}
              <Route path="/explore" element={<ExplorePage />} />

              {/* Fallback Route for 404 or unmatched paths */}
              <Route path="/create" element={<CreateCourse />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/library" element={<LibraryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    ),
    []
  );
}
