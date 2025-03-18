// Layout.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../myComponents/SideNav"; // Import your SideNav component
import BottomNav from "../myComponents/BottomNav"; // Import the new BottomNav component
import "./Layout.css";
import LoginModal from "./Login";
import { ToastProvider, ToastViewport } from "../components/ui/toast.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";

const Layout = () => {
  const [navOpen, setNavOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { getUserCourses } = useCoursesActivity();
  const { pathname } = useLocation();

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  // When the user changes, fetch user courses
  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user?.id]);

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <TooltipProvider>
        <ToastProvider>
          <div className="flex flex-col w-full overflow-x-hidden min-h-screen bg-background-dark dark:bg-gray-900">
            {!user?.id && <LoginModal />}

            {/* Show side navigation on desktop */}
            {!isMobile && (
              <div className="fixed h-full">
                <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
              </div>
            )}

            {/* Main content area */}
            <div
              className={`w-full rounded-2xl bg-background dark:bg-gray-800 flex-1 ${
                !isMobile && navOpen
                  ? "pageWithNavOpen"
                  : !isMobile && !navOpen
                  ? "pageWithNavClosed"
                  : ""
              }`}
              style={{
                minHeight: "100vh",
                paddingLeft: isMobile ? "0" : "", // Remove padding on mobile
                paddingRight: isMobile ? "0" : "", // Remove padding on mobile
                marginLeft: isMobile ? "0" : "", // Remove margin on mobile
                paddingBottom: isMobile ? "200px" : "20px",
              }}
            >
              <Outlet /> {/* This renders the matched child route */}
            </div>

            {/* Show bottom navigation on mobile */}
            {isMobile && <BottomNav />}
          </div>
          <ToastViewport />
        </ToastProvider>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
