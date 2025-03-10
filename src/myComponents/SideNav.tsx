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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import "./SideNav.css";
import { useEffect, useState } from "react";

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
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import SupportModal from "./SupportModal.tsx";

const navItems = [
  {
    name: "library",
    href: "/library",
    icon: Library,
  },
  { name: "explore", href: "/explore", icon: Compass },
  { name: "create", href: "/create", icon: CirclePlus },
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

  const { courses } = useCoursesActivity();
  const { user, signOut, setShowLoginModal } = useAuth();
  const { id } = useParams();
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const deleteCourse = async (courseId: string) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const res = await fetch(`${SERVER}/delete_course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      }
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
      // if (window.innerWidth <= 768) {
      //   setNavOpen(false);
      // }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`side-nav ${navOpen ? "open" : "closed"}`}>
      <div className="scroll-container">
        <div className="scroll-view">
          <div className="flex flex-col h-full px-3 py-4 relative">
            {/* Logo and toggle button */}
            <div className="logo-section">
              {navOpen ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <FaFeatherAlt className="h-5 w-5 text-slate-800" />
                    <span className="ml-2 font-semibold text-slate-800">
                      CourseCraft
                    </span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 action-button justify-self-end rounded-full"
                        onClick={() => setNavOpen(false)}
                        style={{
                          borderRadius: "50%",
                        }}
                      >
                        <ArrowLeftToLine size={18} className="bg-transparent" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={5}
                      className="z-50 bg-slate-800 hover:bg-slate-900 text-white"
                    >
                      <p>Collapse</p>
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
                        className="p-2 action-button justify-self-end rounded-full"
                        onClick={() => setNavOpen(true)}
                        style={{
                          borderRadius: "50%",
                        }}
                      >
                        <ArrowLeftToLine size={18} className="bg-transparent" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="z-100 bg-slate-800 hover:bg-slate-900 text-white">
                      <p>Collapse</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Main navigation */}
            <div className="space-y-1 mt-2">
              {navItems.map((item) => {
                if (item.name === "library" && !user?.id) return null;
                const isActive = item.href === url;

                return (
                  <div
                    key={item.href}
                    className={`nav-item ${isActive ? "active" : " "} ${
                      !delayedOpen ? "justify-center " : ""
                    }`}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="h-5 w-5 text-slate-600" />
                    {delayedOpen && (
                      <span className="ml-3 text-sm font-medium capitalize">
                        {item.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* My Courses Section */}
            {navOpen && courses && courses.length > 0 && (
              <div>
                <Separator className="my-4" />
                <div className="mb-2 px-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    My Courses
                  </h3>
                </div>
                <div className="space-y-1">
                  {courses.map((course) => {
                    const isActive = course.course_id === id;

                    return (
                      <div
                        key={course.course_id}
                        className={`course-item p-2 relative ${
                          isActive ? "active" : ""
                        }`}
                        onMouseEnter={() => setHoveredCourse(course.course_id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        onClick={() => navigate(`/course/${course.course_id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center overflow-hidden">
                            <Book className="h-4 w-4 text-slate-500 flex-shrink-0" />
                            <span className="ml-2 text-sm truncate">
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
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-0 w-32 shadow-md"
                              align="end"
                              side="right"
                              sideOffset={5}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
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
                        </div>
                      </div>
                    );
                  })}
                  {courses.map((course) => {
                    const isActive = course.course_id === id;

                    return (
                      <div
                        key={course.course_id}
                        className={`course-item p-2 relative ${
                          isActive ? "active" : ""
                        }`}
                        onMouseEnter={() => setHoveredCourse(course.course_id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        onClick={() => navigate(`/course/${course.course_id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center overflow-hidden">
                            <Book className="h-4 w-4 text-slate-500 flex-shrink-0" />
                            <span className="ml-2 text-sm truncate">
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
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-0 w-32 shadow-md"
                              align="end"
                              side="right"
                              sideOffset={5}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed-footer">
        <Separator className="mb-4" />
        <div className="px-3">
          <div
            className={`footer-button p-2 flex items-center cursor-pointer ${
              !delayedOpen ? "justify-center " : ""
            }`}
            onClick={() => setSupportModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5 text-slate-600" />
            {navOpen && <span className="ml-3 text-sm font-medium">Help</span>}
          </div>

          {user?.id ? (
            <Button
              variant="outline"
              className="w-full mt-2 gap-2 justify-start border-slate-300"
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
              {navOpen && <span>Log Out</span>}
            </Button>
          ) : (
            <Button
              className="w-full mt-2 gap-2 justify-start bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)]"
              onClick={() => setShowLoginModal(true)}
            >
              <LogIn className="h-4 w-4" />
              {navOpen && <span>Sign in</span>}
            </Button>
          )}
        </div>
      </div>
      <SupportModal
        supportModalOpen={supportModalOpen}
        setSupportModalOpen={setSupportModalOpen}
      />
    </div>
  );
}
