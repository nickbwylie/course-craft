import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import CreateCourse from "./pages/CreateCourse";
import ViewCourse from "./pages/ViewCourse";
import LandingPage from "./pages/LandingPage";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import { useMemo } from "react";
import LibraryPage from "./pages/LibraryPage";
// import Login from "./pages/Login";

export default function App() {
  return useMemo(
    () => (
      <BrowserRouter>
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/login" element={<Login />} /> */}

          {/*  */}
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
    ),
    []
  );
}
