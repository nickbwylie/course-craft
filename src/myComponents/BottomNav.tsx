import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileSideMenu from "@/myComponents/MobileSideMenu";
import {
  CirclePlus,
  Search,
  Menu,
  Library,
  Settings,
  CircleDollarSign,
  MoreHorizontal,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@/styles/useTheme";
import { lightTheme, darkTheme } from "@/styles/myTheme";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Primary navigation items (always visible)
const primaryNavItems = [
  { name: "explore", href: "/explore", icon: Search, requiresAuth: false },
  { name: "create", href: "/create", icon: CirclePlus, requiresAuth: false },
  { name: "library", href: "/library", icon: Library, requiresAuth: true },
  {
    name: "store",
    href: "/token_store",
    icon: CircleDollarSign,
    requiresAuth: false,
  },
] as const;

// Secondary navigation items (shown in More menu)
const secondaryNavItems = [
  { name: "settings", href: "/settings", icon: Settings, requiresAuth: true },
  // Add more secondary items here as needed
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === darkTheme;

  const getButtonStyles = (isActive: boolean) =>
    `flex flex-col items-center justify-center flex-1 py-4 px-2 rounded-none h-full ${
      isActive
        ? "text-cyan-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-cyan-400 border-t-black dark:border-t-cyan-500 border-t-4 hover:text-cyan-700 dark:hover:text-cyan-400 mt-[-4px]"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  const handleNavigation = (href: string, requiresAuth: boolean) => {
    if (requiresAuth && !user?.id) {
      setShowLoginModal(true);
    } else {
      navigate(href);
      setIsMoreMenuOpen(false);
    }
  };

  // Show sidebar for more extensive options
  const openSidebar = () => {
    setIsMobileMenuOpen(true);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      <div
        ref={navRef}
        className="fixed left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-md z-50 md:hidden"
        style={{
          bottom: 0,
          position: "fixed",
          zIndex: 50,
          padding: 0,
        }}
      >
        <div className="flex items-center justify-between px-3">
          {/* Primary Navigation Items */}
          {primaryNavItems.map((item) => {
            if (item.requiresAuth && !user?.id) return null;
            const isActive = item.href === location.pathname;
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={getButtonStyles(isActive)}
                onClick={() => handleNavigation(item.href, item.requiresAuth)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium mt-1 capitalize">
                  {item.name}
                </span>
              </Button>
            );
          })}

          {/* More Button with Popover */}
          <Popover open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className={getButtonStyles(false)}>
                {isMoreMenuOpen ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <MoreHorizontal className="h-6 w-6" />
                )}
                <span className="text-sm font-medium mt-1">More</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-48 p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-t-lg rounded-b-none shadow-lg"
              side="top"
              align="end"
            >
              <div className="space-y-1">
                {secondaryNavItems.map((item) => {
                  if (item.requiresAuth && !user?.id) return null;
                  const Icon = item.icon;
                  const isActive = item.href === location.pathname;

                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={`w-full justify-start hover:bg-slate-950 ${
                        isActive
                          ? "bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                      onClick={() =>
                        handleNavigation(item.href, item.requiresAuth)
                      }
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      <span className="capitalize">{item.name}</span>
                    </Button>
                  );
                })}

                {/* Full menu option */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600 dark:text-slate-300 hover:bg-slate-950"
                  onClick={openSidebar}
                >
                  <Menu className="h-5 w-5 mr-2" />
                  <span>Full Menu</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Side Menu Sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
    </>
  );
}
