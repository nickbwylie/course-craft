import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Compass,
  CirclePlus,
  Book,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  ArrowLeftToLine,
  ArrowRightToLine,
  LogIn,
  MoreVertical,
  Trash,
  MoreHorizontal,
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

const navItems = [
  {
    name: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    iconSelected: LayoutDashboard,
  },
  { name: "explore", href: "/explore", icon: Compass },
  { name: "create", href: "/create", icon: CirclePlus },
] as const;

interface SideNavProps {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface CourseItemProps {
  item: string;
  onDelete: (item: string) => void;
}
const CourseItem = ({ item, onDelete }: CourseItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{item}</span>

      {isHovered && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2"
              onClick={() => onDelete(item)}
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

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

  const deleteCourse = async (courseId: string) => {
    // Implement the delete logic here
    // For now, just log the courseId to be deleted
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const res = await fetch(`${SERVER}/delete_course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`, // Include JWT
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      console.log("data returned", res);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
      });
      return;
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
    // Function to handle window resize
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        // Screen width is less than or equal to 768px
        setNavOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`fixed h-full z-10 h-full side-nav ${
        navOpen ? "open" : "closed"
      }`}
      //   style={{ overflowX: "hidden" }}
    >
      <ScrollArea className="h-screen w-full px-4 py-6">
        <div className="flex flex-col space-y-4 ">
          <h3
            className={`w-full text-center font-semibold text-xl font-bold text-slate-600 flex flex-row truncate ${
              navOpen ? "justify-between" : "justify-center"
            } items-center`}

            // style={navOpen ? { width: "100%" } : { width: "auto" }}
          >
            {navOpen && <FaFeatherAlt className="h-5 w-5 text-slate-800" />}

            {navOpen && (
              <span className="text-slate-800 text-md flex flex-nowrap">
                CourseCraft
              </span>
            )}
            <div className="p-2 rounded-full">
              {navOpen ? (
                <ArrowLeftToLine
                  width={20}
                  height={20}
                  className="text-slate-700 cursor-pointer"
                  onClick={() => setNavOpen(false)}
                />
              ) : (
                <ArrowRightToLine
                  width={20}
                  height={20}
                  className="text-slate-700 cursor-pointer justify-self-center"
                  onClick={() => setNavOpen(true)}
                />
              )}
            </div>
          </h3>

          {/* Navigation Links */}
          {navItems.map((item) => {
            if (item.name === "dashboard" && !user?.id) return null;

            return (
              <div
                key={item.href}
                className={`flex flex-row items-center p-2 rounded-lg cursor-pointer transition-all font-semibold  ${
                  !navOpen && "justify-center"
                } ${
                  item.href === url
                    ? "bg-white text-slate-900 border border-2 border-slate-400"
                    : "text-gray-500 hover:bg-white border border-2 border-transparent"
                }`}
                onClick={() => navigate(item.href)}
              >
                <div>
                  <item.icon className={`${navOpen && "mr-2"} h-5 w-5`} />
                </div>
                {delayedOpen && (
                  <h5 className="text-base capitalize">{item.name}</h5>
                )}
              </div>
            );
          })}

          {navOpen && courses && courses.length > 0 && <Separator />}

          {/* My Courses Section */}
          {navOpen && courses && courses.length > 0 && (
            <div>
              {/* Ensure the parent allows overflow */}
              <h5 className="p-2 mb-2 text-md font-semibold truncate">
                My Courses
              </h5>
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className={`relative flex flex-col w-full space-y-1 rounded-lg transition hover:bg-white ${
                    course.course_id === id ? "bg-white" : ""
                  } cursor-pointer mb-4 overflow-visible`} // Ensure visibility
                  onMouseEnter={() => setHoveredCourse(course.course_id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                  onClick={() => navigate(`/course/${course.course_id}`)}
                >
                  {/* Course Title with Hover Actions */}
                  <div className="flex items-center justify-between px-2 py-1 relative">
                    <div className="flex items-center overflow-hidden">
                      <div>
                        <Book className="h-4 w-4 text-gray-500" />
                      </div>
                      <h5 className="pl-1 truncate text-sm">
                        {course.course_title}
                      </h5>
                    </div>

                    {/* Always Render the Popover, but Only Show the Button on Hover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          // size="icon"
                          className={`p-1 w-8 h-8 transition absolute right-2 top-1 ${
                            hoveredCourse === course.course_id
                              ? "opacity-100 visible"
                              : "opacity-0 invisible"
                          }`}
                          style={{
                            backgroundColor:
                              hoveredCourse === course.course_id
                                ? "rgba(255, 255, 255, 0.3)"
                                : "transparent",
                            zIndex: 50,
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevents navigation on click
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-32 p-0 bg-white shadow-lg rounded-md border z-50"
                        align="center" // Ensures it aligns within the viewport
                        side="right" // Ensures it's not cut off
                        sideOffset={4} // Moves it slightly down to prevent clipping
                      >
                        <Button
                          variant="ghost"
                          className="w-full flex items-center gap-2"
                          onClick={() => deleteCourse(course.course_id)}
                        >
                          <Trash className="w-4 h-4 text-red-800" />
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center space-x-2 px-2">
                    <Progress value={45} className="h-2 flex-grow" />
                    <span className="text-xs text-gray-600">45%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {navOpen && <Separator />}

          {/* Support and Logout */}
          <div className="mt-auto w-full h-full space-y-2 flex grow flex-col self-baseline">
            <div
              className={`flex w-full items-center ${
                !navOpen && "justify-center"
              }  p-2 rounded-lg hover:bg-gray-100 cursor-pointer`}
              onClick={() => navigate("/support")}
            >
              <HelpCircle
                className={`${navOpen && "mr-3"} h-5 w-5 text-gray-500`}
              />
              {navOpen && <h5 className="text-base">Support</h5>}
            </div>

            {user?.id ? (
              <div className="w-full absolute bottom-4 pr-8">
                <Button
                  className={`w-full flex flex-row items-center ${
                    !navOpen && "justify-center"
                  }  p-2 rounded-lg cursor-pointer`}
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid gray",
                  }}
                  onClick={() => {
                    // if route is dashboard navigate to home
                    if (url === "/dashboard") {
                      navigate("/");
                    }
                    signOut();
                    toast({
                      title: "Log out",
                      description: "User has logged out",
                    });
                  }}
                >
                  <LogOut
                    className={`${navOpen && "mr-3"} h-5 w-5 text-black`}
                  />
                  {navOpen && <h5 className="text-base text-black">Log Out</h5>}
                </Button>
              </div>
            ) : (
              <div className="w-full absolute bottom-4 pr-8">
                <Button
                  className={`w-full flex flex-row items-center ${
                    !navOpen && "justify-center"
                  }  p-2 rounded-lg cursor-pointer`}
                  style={{ backgroundColor: "rgb(64, 126, 139)" }}
                  onClick={() => setShowLoginModal(true)}
                >
                  <LogIn
                    className={`${navOpen && "mr-3"} h-5 w-5 text-white`}
                  />
                  {navOpen && (
                    <h5 className="text-base text-white">Sign up/in</h5>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
