import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext";
import { useParams } from "react-router-dom";
import { FaFeatherAlt } from "react-icons/fa";
import { SERVER } from "@/constants";
import { supabase } from "@/supabaseconsant";
import { Book, HelpCircle, LogOut, LogIn, Trash } from "lucide-react";
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
      <div className="px-4 py-3 border-b flex items-center">
        <div className="flex items-center">
          <FaFeatherAlt className="h-5 w-5 text-slate-800" />
          <span className="ml-2 font-semibold text-slate-800">CourseCraft</span>
        </div>
        {/* Removed duplicate close button */}
      </div>

      <div className="side-nav-content">
        <div className=" w-full flex-1 py-2">
          {/* My Courses Section */}
          {courses && courses.length > 0 && (
            <>
              <div className="mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                          <Book className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <span className="ml-2 text-sm truncate">
                            {course.course_title}
                          </span>
                        </div>
                        <div>
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
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
      <div className="side-nav-footer" style={{ backgroundColor: "white" }}>
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            className="w-full gap-2 justify-start border-slate-300"
            onClick={() => setSupportModalOpen(true)}
          >
            <HelpCircle className="h-4 w-4 text-slate-600" />

            <span className=" text-sm font-medium">Help</span>
          </Button>
          {user?.id ? (
            <Button
              variant="outline"
              className="w-full gap-2 justify-start border-slate-300"
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
              className="w-full gap-2 justify-start bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)]"
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

      {/* Delete Confirmation Dialog */}
      <SupportModal
        supportModalOpen={supportModalOpen}
        setSupportModalOpen={setSupportModalOpen}
      />
    </div>
  );
}
