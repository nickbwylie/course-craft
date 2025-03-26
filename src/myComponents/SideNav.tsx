import { Separator } from "@/components/ui/separator";
import {
  Compass,
  CirclePlus,
  Book,
  HelpCircle,
  LogOut,
  ArrowLeftToLine,
  LogIn,
  MoreHorizontal,
  Trash,
  Library,
  ChevronRight,
  ArrowRightToLine,
  Settings, // Added Settings icon
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import "./SideNav.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast.ts";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext.tsx";
import { useParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { SERVER } from "@/constants.ts";
import { supabase } from "@/supabaseconsant.ts";
import { FaFeatherAlt } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import SupportModal from "./SupportModal.tsx";
import ThemeToggle from "./ThemeToggle.tsx";
import { useDeleteCourse, useUserCourses } from "@/hooks/useUserCourses.ts";

// Define navigation items including Settings
const navItems = [
  {
    name: "library",
    href: "/library",
    icon: Library,
    requiresAuth: true,
  },
  {
    name: "explore",
    href: "/explore",
    icon: Compass,
    requiresAuth: false,
  },
  {
    name: "create",
    href: "/create",
    icon: CirclePlus,
    requiresAuth: false,
  },
] as const;

interface SideNavProps {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideNav({ navOpen, setNavOpen }: SideNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname;
  const { toast } = useToast();
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [delayedOpen, setDelayedOpen] = useState(navOpen);
  const [width, setWidth] = useState(window.innerWidth);

  const { user, signOut, setShowLoginModal } = useAuth();
  const { id } = useParams();
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const { data: courses, isLoading, isError } = useUserCourses();
  const deleteUserCourse = useDeleteCourse();

  const deleteCourse = async (courseId: string) => {
    try {
      deleteUserCourse.mutate(courseId);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
      });
    }
  };

  useEffect(() => {
    async function delayedOpenUpdate() {
      if (!navOpen) {
        setDelayedOpen(navOpen);
      } else {
        setTimeout(() => {
          setDelayedOpen(navOpen);
        }, 50);
      }
    }

    delayedOpenUpdate();
  }, [navOpen]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`side-nav ${
        navOpen ? "open" : "closed"
      } dark:bg-gray-900 dark:border-gray-700`}
    >
      {/* Fixed Header */}
      <div className="side-nav-header dark:bg-gray-900">
        {navOpen ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FaFeatherAlt className="h-5 w-5 text-slate-800 dark:text-slate-200" />
              <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">
                CourseCraft
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 action-button justify-self-end rounded-full dark:hover:bg-gray-800"
                  onClick={() => setNavOpen(false)}
                >
                  <ArrowLeftToLine size={18} className="bg-transparent" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="z-50 bg-slate-800 text-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.4 }}
                  className="bg-slate-800 text-white rounded text-sm"
                >
                  Collapse
                </motion.div>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 action-button rounded-full dark:hover:bg-gray-800"
                  onClick={() => setNavOpen(true)}
                >
                  <ArrowRightToLine size={18} className="bg-transparent" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 bg-slate-800 text-white"
              >
                <p>Expand</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="side-nav-content">
        {/* Main navigation */}
        <div className="space-y-1 pb-2">
          {navItems.map((item) => {
            if (item.requiresAuth && !user?.id) return null;
            const isActive = item.href === url;

            return (
              <div
                key={item.href}
                className={`nav-item ${isActive ? "active" : ""} ${
                  !delayedOpen ? "justify-center" : ""
                } dark:hover:bg-gray-800 dark:text-slate-300`}
                onClick={() => navigate(item.href)}
              >
                <item.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                {delayedOpen && (
                  <span className="ml-3 text-sm font-medium capitalize">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}

          {/* Add Settings nav item - only show when logged in */}
          {user?.id && (
            <div
              className={`nav-item ${url === "/settings" ? "active" : ""} ${
                !delayedOpen ? "justify-center" : ""
              } dark:hover:bg-gray-800 dark:text-slate-300`}
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              {delayedOpen && (
                <span className="ml-3 text-sm font-medium capitalize">
                  Settings
                </span>
              )}
            </div>
          )}
        </div>

        {/* My Courses Section */}
        {delayedOpen && courses && courses.length > 0 && (
          <div className="mt-4">
            <Separator className="my-4 dark:bg-gray-700" />
            <div className="mb-2 px-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                My Courses
              </h3>
            </div>
            <div className="space-y-1">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05, // Reduced from 0.1 for smoother sequence
                      delayChildren: 0.1, // Add a small initial delay
                      staggerDirection: 1, // Ensure forward direction
                      ease: "easeOut", // Add easing function
                    },
                  },
                  hidden: {},
                }}
              >
                {courses.map((course) => {
                  const isActive = course.course_id === id;
                  return (
                    <motion.div
                      key={course.course_id}
                      variants={{
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.4, // Slightly longer duration
                            ease: "easeOut", // Smooth easing function
                          },
                        },
                        hidden: {
                          opacity: 0,
                          y: 15, // Reduced from 20 for subtler effect
                          transition: {
                            duration: 0.3, // Quick exit animation
                          },
                        },
                      }}
                      className={`course-item p-2 relative ${
                        isActive ? "active" : ""
                      } dark:hover:bg-gray-800 dark:text-slate-300`}
                      onMouseEnter={() => setHoveredCourse(course.course_id)}
                      onMouseLeave={() => setHoveredCourse(null)}
                      onClick={() => navigate(`/course/${course.course_id}`)}
                    >
                      {/* Rest of your component content */}
                      <div className="flex items-center overflow-hidden">
                        <Book className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                        <span className="ml-2 text-sm truncate-text">
                          {course.course_title}
                        </span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`p-1 h-7 w-7 action-button transition-opacity ${
                              hoveredCourse === course.course_id
                                ? "opacity-100"
                                : "opacity-0"
                            } dark:hover:bg-gray-700`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 w-32 shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
                          align="end"
                          side="right"
                          sideOffset={5}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCourse(course.course_id);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="side-nav-footer dark:bg-gray-900">
        <div className="flex justify-between items-center mb-2 px-2">
          <div
            className={`footer-button p-2 flex items-center cursor-pointer ${
              !delayedOpen ? "justify-center w-10" : "justify-start"
            } dark:text-slate-300`}
            onClick={() => setSupportModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            {delayedOpen && (
              <span className="ml-3 text-sm font-medium">Help</span>
            )}
          </div>
          {delayedOpen && <ThemeToggle variant="ghost" size="sm" />}
        </div>

        {user?.id ? (
          <Button
            variant="outline"
            className={`${
              delayedOpen
                ? "w-full justify-start px-4"
                : "w-full h-10 p-0 justify-center"
            } gap-2 border-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-gray-800`}
            onClick={() => {
              if (url === "/dashboard") {
                navigate("/");
              }
              signOut();
              toast({
                title: "Success",
                description: "You have been logged out",
              });
            }}
          >
            <LogOut className="h-4 w-4" />
            {delayedOpen && <span className="ml-1">Log Out</span>}
          </Button>
        ) : (
          <Button
            className={`${
              delayedOpen
                ? "w-full justify-start p-2"
                : "justify-center w-full h-10 p-0"
            } gap-2 bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)] dark:bg-[rgb(74,136,149)] dark:hover:bg-[rgb(84,146,159)] text-white`}
            onClick={() => setShowLoginModal(true)}
          >
            <LogIn className="h-5 w-5" />
            {delayedOpen && <span className="ml-1 text-white">Sign in</span>}
          </Button>
        )}

        {/* Support Modal */}
        <SupportModal
          supportModalOpen={supportModalOpen}
          setSupportModalOpen={setSupportModalOpen}
        />
      </div>
    </div>
  );
}
