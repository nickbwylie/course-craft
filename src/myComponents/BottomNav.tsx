import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileSideMenu from "@/myComponents/MobileSideMenu";
import { CirclePlus, Search, Menu, ChevronLeft, Library } from "lucide-react";
import { useTheme } from "@/styles/useTheme";
import { lightTheme, darkTheme } from "@/styles/myTheme";

const navItems = [
  { name: "library", href: "/library", icon: Library, requiresAuth: true },
  { name: "explore", href: "/explore", icon: Search, requiresAuth: false },
  { name: "create", href: "/create", icon: CirclePlus, requiresAuth: false },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCoursePage = location.pathname.includes("/course/");
  const navRef = useRef<HTMLDivElement>(null);
  const [safeAreaBottom, setSafeAreaBottom] = useState("16px");
  const { theme } = useTheme();
  const isDarkMode = theme === darkTheme;

  // Update safe area inset
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const updateSafeArea = () => {
      if (isIOS) {
        setSafeAreaBottom(`max(env(safe-area-inset-bottom, 16px), 16px)`);
      } else {
        setSafeAreaBottom("16px");
      }
    };

    updateSafeArea();
    window.addEventListener("resize", updateSafeArea);
    window.addEventListener("orientationchange", updateSafeArea);

    return () => {
      window.removeEventListener("resize", updateSafeArea);
      window.removeEventListener("orientationchange", updateSafeArea);
    };
  }, []);

  const getButtonStyles = (isActive: boolean) =>
    `flex flex-col items-center justify-center flex-1 py-4 px-2 rounded-none h-full ${
      isActive
        ? "text-cyan-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-cyan-400 border-t-black dark:border-t-cyan-500 border-t-4 hover:text-cyan-700 dark:hover:text-cyan-400 mt-[-4px]"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <>
      <div
        ref={navRef}
        className="fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 shadow-md z-50 md:hidden"
        style={{
          bottom: 0,
          position: "fixed",
          zIndex: 50,
          padding: 0,
        }}
      >
        <div className="flex items-center justify-between px-3">
          {isCoursePage ? (
            <Button
              variant="ghost"
              className={getButtonStyles(false)}
              onClick={() => {
                if (window.history.state && window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/explore");
                }
              }}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="text-sm font-medium mt-1">Back</span>
            </Button>
          ) : (
            <>
              {navItems.map((item) => {
                if (item.requiresAuth && !user?.id) return null;
                const isActive = item.href === location.pathname;
                const Icon = item.icon;

                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={getButtonStyles(isActive)}
                    onClick={() => {
                      if (item.requiresAuth && !user?.id) {
                        setShowLoginModal(true);
                      } else {
                        navigate(item.href);
                      }
                    }}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium mt-1 capitalize">
                      {item.name}
                    </span>
                  </Button>
                );
              })}
            </>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className={getButtonStyles(false)}>
                <Menu className="h-6 w-6" />
                <span className="text-sm font-medium mt-1">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="p-0 w-[300px] dark:bg-slate-900 dark:border-slate-700"
            >
              <MobileSideMenu
                onClose={() => setIsMobileMenuOpen(false)}
                onNavigate={(path) => {
                  navigate(path);
                  setIsMobileMenuOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden behind the nav */}
    </>
  );
}
