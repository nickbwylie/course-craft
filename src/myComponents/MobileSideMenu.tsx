import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext";
import { useParams } from "react-router-dom";
import { FaFeatherAlt } from "react-icons/fa";
import { SERVER } from "@/constants";
import { supabase } from "@/supabaseconsant";
import {
  Book,
  HelpCircle,
  LogOut,
  LogIn,
  Trash,
  Moon,
  Sun,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SupportModal from "./SupportModal";
import "./SideNav.css";
import { useTheme } from "@/styles/useTheme";
import { lightTheme, darkTheme } from "@/styles/myTheme";
// import ThemeToggle from "./ThemeToggle";
import { useUserCourses } from "@/hooks/useUserCourses";

interface MobileSideMenuProps {
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function MobileSideMenu({
  onClose,
  onNavigate,
}: MobileSideMenuProps) {
  const { toast } = useToast();
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [deletingCourseTitle, setDeletingCourseTitle] = useState("");
  const { data: courses } = useUserCourses();
  const { user, signOut, setShowLoginModal } = useAuth();
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === darkTheme;

  const deleteCourse = async (courseId: string) => {
    try {
      setCourseToDelete(null);
      setIsDeleteDialogOpen(false);

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

  return (
    <div className="flex flex-col h-full bg-[#f3f3ef] dark:bg-slate-900">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <FaFeatherAlt className="h-5 w-5 text-slate-800 dark:text-slate-200" />
          <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">
            CourseCraft
          </span>
        </div>
      </div>

      <div className="side-nav-content dark:bg-slate-900">
        <div className="w-full flex-1 py-2">
          {/* My Courses Section */}
          {courses && courses.length > 0 && (
            <>
              <div className="mb-2 px-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  My Courses
                </h3>
              </div>
              <div className="space-y-1 mb-6">
                {courses.map((course) => {
                  const isActive = course.course_id === id;

                  return (
                    <div
                      key={course.course_id}
                      className={`course-item p-2 ${isActive ? "active" : ""}`}
                    >
                      <div className="w-full flex items-center justify-between">
                        <div
                          className="flex items-center overflow-hidden flex-1 cursor-pointer"
                          onClick={() =>
                            onNavigate(`/course/${course.course_id}`)
                          }
                        >
                          <Book className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                          <span className="ml-2 text-sm truncate dark:text-slate-300">
                            {course.course_title}
                          </span>
                        </div>
                        <div>
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCourseToDelete(course.course_id);
                              setDeletingCourseTitle(course.course_title);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer with auth buttons */}
      <div className="side-nav-footer dark:bg-gray-900">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center mb-2 px-4">
            <div
              className={`footer-button p-2 px-0 flex items-center cursor-pointer 
           justify-start
           dark:text-slate-300`}
              onClick={() => setSupportModalOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />

              <span className="ml-2 text-sm font-medium">Help</span>
            </div>
            {/* <ThemeToggle variant="ghost" size="sm" /> */}
          </div>
          {user?.id ? (
            <Button
              variant="outline"
              className="w-full gap-2 justify-start border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => {
                signOut();
                onClose();
                toast({
                  title: "Success",
                  description: "You have been logged out",
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          ) : (
            <Button
              className="w-full gap-2 px-3 justify-start bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)]  text-white"
              onClick={() => {
                setShowLoginModal(true);
                onClose();
              }}
            >
              <LogIn className="h-5 w-5" />
              <span>Sign in</span>
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Delete Course
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              Are you sure you want to delete "{deletingCourseTitle}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setCourseToDelete(null)}
              className="hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => courseToDelete && deleteCourse(courseToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Support Modal */}
      <SupportModal
        supportModalOpen={supportModalOpen}
        setSupportModalOpen={setSupportModalOpen}
      />
    </div>
  );
}
