import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import CreateCourse from "./pages/CreateCourse";
import ViewCourse from "./pages/ViewCourse";
import LandingPage from "./pages/LandingPage";
import Layout from "./pages/Layout";
import { useEffect, useMemo } from "react";
import LibraryPage from "./pages/LibraryPage";
import { ThemeProvider } from "./styles/useTheme"; // Import ThemeProvider
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Import our animation components
import SettingsPage from "./pages/SettingsPage";
import { useTracking } from "./hooks/useTracking";
import { useAuth } from "./contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import SubscriptionPage from "./pages/Subscription";

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
  const { trackEvent } = useTracking();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    trackEvent("website visit", user?.id, {
      page_url: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }, [user?.id]);

  useEffect(() => {
    trackEvent("page_view", user?.id, {
      page_url: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
    });
    const authRoutes = ["/library", "/settings"];
    if (!user && !isLoading && authRoutes.includes(window.location.pathname)) {
      window.location.href = "/explore";
    }
  }, [window.location.pathname, trackEvent, user?.id, isLoading]);

  return useMemo(
    () => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <HelmetProvider>
            <BrowserRouter>
              {/* Wrap Routes with AnimatedLayout for page transitions */}

              <Routes>
                {/* Home Page Route */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* Routes that require the side navigation */}
                <Route element={<Layout />}>
                  <Route path="course/:id" element={<ViewCourse />} />

                  {/* Explore Page Route */}
                  <Route path="/explore" element={<ExplorePage />} />

                  {/* Fallback Route for 404 or unmatched paths */}
                  <Route path="/create" element={<CreateCourse />} />

                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  <Route path="/token_store" element={<SubscriptionPage />} />

                  {/* <Route path="/checkout" element={<CheckoutWrapper />} /> */}
                </Route>
              </Routes>
            </BrowserRouter>
          </HelmetProvider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
    []
  );
}
