import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import ThemeToggle from "./ThemeToggle"; // Import ThemeToggle
import { useTheme } from "@/styles/useTheme"; // Import useTheme hook

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
  const { courses } = useCoursesActivity();
  const { user, signOut, setShowLoginModal } = useAuth();
  const { id } = useParams();

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <FaFeatherAlt className="h-5 w-5 text-primary" />
          <span className="ml-2 font-semibold text-primary">CourseCraft</span>
        </div>
        <ThemeToggle variant="ghost" size="sm" />{" "}
        {/* Add theme toggle button */}
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        {/* My Courses Section */}
        {courses && courses.length > 0 && (
          <>
            <div className="mb-2">
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
                    className={`course-item p-2 relative ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center overflow-hidden flex-1 cursor-pointer"
                        onClick={() =>
                          onNavigate(`/course/${course.course_id}`)
                        }
                      >
                        <Book className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                        <span className="ml-2 text-sm truncate">
                          {course.course_title}
                        </span>
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                );
              })}
            </div>
          </>
        )}

        {/* Support link */}
        <div
          className="p-2 rounded-lg flex items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          onClick={() => setSupportModalOpen(true)}
        >
          <HelpCircle className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <span className="ml-3 text-sm">Help</span>
        </div>
      </ScrollArea>

      {/* Footer with auth buttons */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
        {user?.id ? (
          <Button
            variant="outline"
            className="w-full gap-2 justify-start border-slate-300 dark:border-slate-700"
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
            className="w-full gap-2 justify-start bg-primary hover:bg-primary-dark"
            onClick={() => {
              setShowLoginModal(true);
              onClose();
            }}
          >
            <LogIn className="h-4 w-4" />
            <span>Sign in</span>
          </Button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCourseTitle}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCourseToDelete(null)}>
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
