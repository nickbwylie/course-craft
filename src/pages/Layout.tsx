// Layout.js
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../myComponents/SideNav"; // Import your SideNav component
import "./Layout.css";
import LoginModal from "./Login";

const Layout = () => {
  const [navOpen, setNavOpen] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // useEffect(() => {
  //   // if user is not authenticated
  //   setLoginModalOpen(true);
  // }, []);

  return (
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
      <LoginModal
        loginModalOpen={loginModalOpen}
        setLoginModalOpen={setLoginModalOpen}
      />
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
  );
};

export default Layout;
