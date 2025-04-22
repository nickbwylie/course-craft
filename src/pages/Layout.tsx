import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../myComponents/SideNav";
import BottomNav from "../myComponents/BottomNav";
import "./Layout.css";
import LoginModal from "./Login";
import { ToastProvider, ToastViewport } from "../components/ui/toast.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { useQueryClient } from "@tanstack/react-query";
import SimpleWalkthrough from "@/animations/OnboardingAnimations.tsx";

const Layout = () => {
  const [navOpen, setNavOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { getUserCourses } = useCoursesActivity();
  const { pathname } = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const queryClient = useQueryClient();
  const [walkthroughOpen, setWalkThroughOpen] = useState(() => {
    // Only show walkthrough if user hasn't seen it before
    return !localStorage.getItem("hasSeenWalkthrough");
  });
  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setNavOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Create a debounced scroll handler to prevent glitches
  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;

      // Reset the scrolling flag after a short delay
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }
  }, []);

  // Add tab visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When tab becomes visible again, ensure scrolling is properly stopped
        isScrollingRef.current = false;

        // Small delay to ensure browser has settled
        setTimeout(() => {
          if (contentRef.current) {
            // Force a tiny scroll to "reset" the scroll state
            const currentPos = contentRef.current.scrollTop;
            contentRef.current.scrollTop = currentPos + 1;
            setTimeout(() => {
              contentRef.current!.scrollTop = currentPos;
            }, 10);
          }
        }, 50);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Scroll to top when pathname changes
  useEffect(() => {
    // Cancel any ongoing scrolling
    isScrollingRef.current = false;

    // Add small delay to ensure everything is ready
    setTimeout(() => {
      if (isMobile && contentRef.current) {
        // For mobile, scroll the content container
        contentRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        // For desktop, use traditional window scroll
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }
    }, 50);
  }, [pathname, isMobile]);

  // When the user changes, fetch user courses
  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user?.id]);

  // Add scroll event listeners for the content container
  useEffect(() => {
    const content = contentRef.current;
    if (isMobile && content) {
      content.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        content.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isMobile, handleScroll]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    queryClient.invalidateQueries({ queryKey: ["userCourses"] });
  }, []);
  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <TooltipProvider>
        <ToastProvider>
          <div className="flex flex-col w-full overflow-hidden min-h-screen bg-background-dark dark:bg-slate-900 ">
            {!user?.id && <LoginModal />}

            {/* Show side navigation on desktop */}
            {!isMobile && (
              <div className="fixed h-full">
                <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
              </div>
            )}

            {/* Main content structure for mobile */}
            {isMobile ? (
              <div className="mobile-layout">
                {/* Small invisible header to force content below iOS address bar */}
                <div className="mobile-header" style={{ height: "1px" }} />

                {/* Scrollable content area */}
                <div
                  className="mobile-content"
                  ref={contentRef}
                  style={{ paddingBottom: "180px", overflowX: "hidden" }}
                >
                  <Outlet />
                </div>

                {/* Bottom nav acts as a footer to contain scroll area */}
                <BottomNav />
              </div>
            ) : (
              /* Desktop layout */
              <div
                className={`w-full rounded-2xl bg-background dark:bg-slate-900 flex-1 ${
                  navOpen ? "pageWithNavOpen" : "pageWithNavClosed"
                }`}
                style={{
                  minHeight: "calc(100vh)",
                  paddingBottom: "20px",
                }}
              >
                <Outlet />
              </div>
            )}
            <SimpleWalkthrough
              isOpen={walkthroughOpen}
              onClose={() => {
                window.localStorage.setItem("hasSeenWalkthrough", "true");
                setWalkThroughOpen(false);
              }}
            />
          </div>
          <ToastViewport />
        </ToastProvider>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
