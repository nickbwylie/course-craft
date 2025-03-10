import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileSideMenu from "@/myComponents/MobileSideMenu";
import { CirclePlus, Search, Menu, ChevronLeft, Library } from "lucide-react";

const navItems = [
  {
    name: "library",
    href: "/library",
    icon: Library,
    requiresAuth: true,
  },
  { name: "explore", href: "/explore", icon: Search, requiresAuth: false },
  { name: "create", href: "/create", icon: CirclePlus, requiresAuth: false },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isCoursePage = location.pathname.includes("/course/");
  const [safeAreaBottom, setSafeAreaBottom] = useState<string>(
    "env(safe-area-inset-bottom, 0px)"
  );
  const [navHeight, setNavHeight] = useState<number>(56); // Default height
  const navRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Handle viewport and safe area
  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    const updateSafeArea = () => {
      // Small delay to ensure safe area values are updated after orientation change
      setTimeout(() => {
        if (isIOS) {
          setSafeAreaBottom("env(safe-area-inset-bottom, 16px)");
        } else {
          setSafeAreaBottom("env(safe-area-inset-bottom, 0px)");
        }

        // Update nav height based on actual element height
        if (navRef.current) {
          const actualHeight = navRef.current.offsetHeight;
          setNavHeight(actualHeight);
        }
      }, 100);
    };

    // Update on resize and orientation change
    window.addEventListener("resize", updateSafeArea);
    window.addEventListener("orientationchange", updateSafeArea);

    // Initial call
    updateSafeArea();

    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", updateSafeArea);
      window.removeEventListener("orientationchange", updateSafeArea);
    };
  }, []);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav when scrolling up or at top/bottom of page
      if (
        currentScrollY <= 20 ||
        currentScrollY < lastScrollY ||
        currentScrollY + window.innerHeight >= document.body.scrollHeight - 20
      ) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide nav when scrolling down (beyond first 100px)
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Make sure nav is visible on page load
    setIsVisible(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const getButtonStyles = (isActive: boolean) =>
    `flex flex-col items-center justify-center flex-1 py-4 px-2 rounded-none h-full ${
      isActive
        ? "text-cyan-700 bg-cyan-50/50 hover:bg-cyan-50"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <>
      <div
        ref={navRef}
        className={`fixed left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 md:hidden transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          bottom: 0,
          paddingBottom: safeAreaBottom,
          // Add viewport-relative positioning as a fallback
          position: "fixed",
          // Ensure the nav sits above other elements
          zIndex: 999,
        }}
      >
        <div className="flex items-center justify-between px-3">
          {isCoursePage ? (
            <>
              <Button
                variant="ghost"
                className={getButtonStyles(false)}
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="text-sm font-medium mt-1">Back</span>
              </Button>
            </>
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
            <SheetContent side="right" className="p-0 w-[300px]">
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
      <div
        className="h-20 md:hidden"
        style={{
          marginBottom: safeAreaBottom,
          visibility: isVisible ? "visible" : "hidden",
          transition: "height 0.3s ease",
        }}
      />
    </>
  );
}
