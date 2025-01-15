// Layout.js
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../myComponents/SideNav"; // Import your SideNav component
import "./Layout.css";
import LoginModal from "./Login";
import { ToastProvider, ToastViewport } from "../components/ui/toast.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext.tsx";

const Layout = () => {
  const [navOpen, setNavOpen] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { user } = useAuth();
  const { getUserCourses } = useCoursesActivity();

  // when the user changes fetch user courses
  useEffect(() => {
    if (user) {
      getUserCourses();
    }
  }, [user?.id]);

  return (
    <ToastProvider>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          height: "100%",
          backgroundColor: "rgb(243	,243	,239)",
        }}
        // className="bg-gray-100"
      >
        {!user?.id && (
          <LoginModal
            loginModalOpen={true}
            setLoginModalOpen={setLoginModalOpen}
          />
        )}
        <div className="fixed">
          <SideNav navOpen={navOpen} setNavOpen={setNavOpen} />
        </div>
        <div
          className={`w-full bg-white rounded-2xl ${
            navOpen ? "pageWithNavOpen" : "pageWithNavClosed"
          } `}
          style={{ backgroundColor: "rgb(252,252,249)" }}
        >
          <Outlet /> {/* This renders the matched child route */}
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
};

export default Layout;
