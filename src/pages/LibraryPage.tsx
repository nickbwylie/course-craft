import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Calendar,
  Library,
  Trash,
  PlayCircle,
  BookOpenCheck,
  Search,
  PlusCircle,
  BookMarked,
  ExternalLink,
} from "lucide-react";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCoursesActivity } from "@/contexts/CoursesActivityContext";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/supabaseconsant";
import { SERVER } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import "@/styles/toast.css"; // Import the toast styles
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { Progress } from "@/components/ui/progress";

interface CourseListItemProps {
  course: CourseWithFirstVideo;
  onDelete?: (courseId: string) => void;
  showProgress?: boolean;
  completionPercentage?: number;
  lastViewed?: string;
}

export function CourseListItem({
  course,
  onDelete,
  showProgress = false,
  completionPercentage = 0,
  lastViewed,
}: CourseListItemProps) {
  const navigate = useNavigate();
  const [publicCourse, setPublicCourse] = useState(course.public);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format last viewed date (relative time)
  const formatLastViewed = (dateStr?: string) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? "Yesterday" : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "Just now";
    }
  };

  // Format duration for display
  const formatDuration = (duration: string) => {
    const [hours, minutes] = duration.split(":").map(Number);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const updateCoursePrivacy = async (newVal: boolean) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update({ public: newVal })
        .eq("id", course.course_id);

      if (error) {
        console.error("Error updating course privacy:", error);
        toast({
          title: "Error",
          description: "Failed to update course privacy",
          variant: "destructive",
        });
        return { success: false, error };
      }

      setPublicCourse(newVal);
      toast({
        title: "Success",
        description: `Course is now ${newVal ? "public" : "private"}`,
        variant: "default",
      });
      return { success: true, data };
    } catch (e) {
      console.error("Unexpected error updating course privacy:", e);
      return { success: false, error: e };
    }
  };

  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-3 bg-white dark:bg-gray-800 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-200 flex items-start gap-3">
      {/* Thumbnail with overlay for quick access */}
      <div
        className="w-24 h-16 md:w-28 md:h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 cursor-pointer group relative"
        onClick={() => navigate(`/course/${course.course_id}`)}
      >
        <img
          src={course.thumbnail_url}
          alt={course.course_title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-1">
          <PlayCircle className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Course Details */}
      <div className="flex-grow min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2 flex-col sm:flex-row">
          <div className="min-w-0 flex flex-col w-full">
            <h3
              className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
              onClick={() => navigate(`/course/${course.course_id}`)}
            >
              {course.course_title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
              {course.course_description}
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-wrap items-center gap-1">
            {!showProgress && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-7 text-gray-600 dark:text-gray-300 text-xs flex items-center gap-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                  >
                    <span className="text-xs">Public</span>
                    <Switch
                      id={`public-${course.course_id}`}
                      checked={publicCourse}
                      onCheckedChange={() => updateCoursePrivacy(!publicCourse)}
                      className="scale-75 data-[state=checked]:bg-cyan-600 dark:data-[state=checked]:bg-cyan-500"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="dark:bg-gray-800 dark:border-gray-700"
                >
                  <p className="text-xs dark:text-gray-200">
                    Make course {publicCourse ? "private" : "public"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {!showProgress && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this course?")
                      ) {
                        onDelete && onDelete(course.course_id);
                      }
                    }}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="dark:bg-gray-800 dark:border-gray-700"
                >
                  <p className="text-xs dark:text-gray-200">Delete course</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Progress bar for in-progress courses */}
        {showProgress && (
          <div className="mt-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {completionPercentage}% complete
              </span>
              {lastViewed && (
                <span className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatLastViewed(lastViewed)}
                </span>
              )}
            </div>
            <Progress value={completionPercentage} className="h-1.5 " />
          </div>
        )}

        {/* Course Meta Info */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500" />
            <span>{formatDate(course.created_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500" />
            <span>{formatDuration(course.total_duration)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500" />
            <span>{course.total_videos} videos</span>
          </div>
          <Badge
            variant="outline"
            className="h-5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-normal border-cyan-100 dark:border-cyan-800/30 px-1.5"
          >
            Normal
          </Badge>
          {publicCourse && (
            <Badge
              variant="outline"
              className="h-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-normal border-emerald-100 dark:border-emerald-800/30 px-1.5 flex items-center gap-1"
            >
              <ExternalLink className="h-2.5 w-2.5" />
              Public
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyLibrary({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="w-full border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <BookMarked className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your library is empty
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Create your first course by combining YouTube videos into a
          personalized learning experience.
        </p>
        <Button
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
          onClick={onCreateClick}
        >
          <PlusCircle className="h-4 w-4" />
          Create a Course
        </Button>
      </CardContent>
    </Card>
  );
}

// In Progress empty state
function EmptyInProgress() {
  const navigate = useNavigate();
  return (
    <Card className="w-full border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
          <BookOpenCheck className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          No courses in progress
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Start learning from your courses or explore new ones to see them
          appear here.
        </p>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => navigate("/explore")}
        >
          <Search className="h-4 w-4" />
          Explore Courses
        </Button>
      </CardContent>
    </Card>
  );
}

function LibraryPage() {
  const [selected, setSelected] = useState(0);
  const tabs = ["My Courses", "In Progress"];
  const { courses, getUserCourses } = useCoursesActivity();
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
          variant: "default",
        });
        // Refresh the course list
        getUserCourses();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };
  const navigate = useNavigate();
  const { inProgressCourses, removeCourseProgress, getCompletionPercentage } =
    useCourseProgress();

  const selectedStyle =
    "pb-2 text-lg cursor-pointer border-b-2 font-normal border-gray-800 dark:border-cyan-500 text-gray-900 dark:text-white";
  const notSelectedStyle =
    "pb-2 text-lg cursor-pointer hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-600 font-light text-gray-700 dark:text-gray-300";

  useEffect(() => {
    getUserCourses();
  }, []);

  // Add this inside your LibraryPage component when rendering the In Progress tab:
  // console.log(
  //   "Course progress:",
  //   inProgressCourses.map((course) => ({
  //     id: course.course_id,
  //     title: course.course_title,
  //     totalVideos: course.total_videos,
  //     watched: course.watchedVideos?.length || 0,
  //     completed: course.completedVideos?.length || 0,
  //     percentage: getCompletionPercentage(course.course_id),
  //   }))
  // );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="mb-6 w-full flex items-center gap-3">
        <Library className="h-6 w-6 text-cyan-600 dark:text-cyan-500" />
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Library
        </h1>
      </div>

      {/* Tabs */}
      <div className="w-full flex space-x-6 mb-8 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab, index) => (
          <div
            key={`${tab}-${index}`}
            onClick={() => setSelected(index)}
            className={index === selected ? selectedStyle : notSelectedStyle}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="w-full">
        {selected === 0
          ? courses?.map((course) => (
              <CourseListItem
                key={course.course_id}
                course={course}
                onDelete={() => {
                  deleteCourse(course.course_id);
                }}
              />
            ))
          : inProgressCourses.map((course) => (
              <CourseListItem
                key={course.course_id}
                showProgress={true}
                completionPercentage={getCompletionPercentage(course.course_id)}
                course={course}
                onDelete={() => {
                  deleteCourse(course.course_id);
                }}
              />
            ))}

        {/* Empty states */}
        {courses.length === 0 && selected === 0 && (
          <EmptyLibrary onCreateClick={() => navigate("/create")} />
        )}
        {courses.length === 0 && selected === 1 && <EmptyInProgress />}
      </div>
    </div>
  );
}

export default LibraryPage;
