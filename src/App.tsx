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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data becomes stale after 24 hours
      staleTime: 24 * 60 * 60 * 1000,
      // Data is removed from cache after 24 hours
      gcTime: 24 * 60 * 60 * 1000,
      // Automatically refetch when stale
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "coursecraft-cache-v1",
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  // Remove persisted cache after 24 hours
  maxAge: 24 * 60 * 60 * 1000,
});

export default function App() {
  return useMemo(
    () => (
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    ),
    []
  );
}
