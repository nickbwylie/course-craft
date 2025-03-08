// Layout.js
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../myComponents/SideNav"; // Import your SideNav component
import "./Layout.css";
import LoginModal from "./Login";
import { ToastProvider, ToastViewport } from "../components/ui/toast.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";

const Layout = () => {
  const [navOpen, setNavOpen] = useState(true);
  const { user } = useAuth();
  const { getUserCourses } = useCoursesActivity();

  // when the user changes fetch user courses
  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user?.id]);

  return (
    <div style={{ minHeight: "100vh", width: "100%" }}>
      <TooltipProvider>
        <ToastProvider>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflowX: "hidden",
              minHeight: "100vh", // Changed from height to minHeight
              backgroundColor: "rgb(243, 243, 239)",
            }}
          >
            {!user?.id && <LoginModal />}
            <div className="fixed h-full">
              <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
            </div>
            <div
              className={`w-full rounded-2xl ${
                navOpen ? "pageWithNavOpen" : "pageWithNavClosed"
              }`}
              style={{
                minHeight: "100vh", // Changed from height to minHeight
                backgroundColor: "rgb(252, 252, 249)",
                flex: "1", // Added flex: 1 to allow it to grow
              }}
            >
              <Outlet /> {/* This renders the matched child route */}
            </div>
          </div>
          <ToastViewport />
        </ToastProvider>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
