import { useState } from "react";
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

interface CourseListItemProps {
  course: CourseWithFirstVideo;
  onDelete?: (courseId: string) => void;
}

export function CourseListItem({ course, onDelete }: CourseListItemProps) {
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
        .update({ public: publicCourse })
        .eq("id", course.course_id);

      if (error) {
        console.error("Error updating course privacy:", error);
        return { success: false, error };
      }

      setPublicCourse(newVal);
      console.log("Course privacy updated successfully");
      return { success: true, data };
    } catch (e) {
      console.error("Unexpected error updating course privacy:", e);
      return { success: false, error: e };
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg p-3 mb-3 bg-white hover:shadow-md transition-all duration-200 flex items-center gap-3">
      {/* Thumbnail with overlay for quick access */}
      <div
        className="w-24 h-16 md:w-28 md:h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer group relative"
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
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="text-base font-semibold text-gray-900 truncate cursor-pointer hover:text-cyan-700 transition-colors"
              onClick={() => navigate(`/course/${course.course_id}`)}
            >
              {course.course_title}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
              {course.course_description}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="h-7 w-24 text-gray-500 text-xs cursor-default"
                >
                  <p className="text-xs">Public</p>
                  <Switch
                    id={`public-${course.course_id}`}
                    checked={publicCourse}
                    onCheckedChange={() => updateCoursePrivacy(!publicCourse)}
                    className="scale-75 bg-black"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  Make course {publicCourse ? "private" : "public"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
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
              <TooltipContent side="top">
                <p className="text-xs">Delete course</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Course Meta Info */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            <span>{formatDate(course.created_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-gray-400" />
            <span>{formatDuration(course.total_duration)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1 text-gray-400" />
            <span>{course.total_videos} videos</span>
          </div>
          <Badge
            variant="outline"
            className="h-5 bg-cyan-50 text-cyan-700 text-xs font-normal border-cyan-100 px-1.5"
          >
            Normal
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyLibrary({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Card className="w-full border border-dashed border-gray-300 bg-white/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <BookMarked className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Your library is empty
        </h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Create your first course by combining YouTube videos into a
          personalized learning experience.
        </p>
        <Button
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700"
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
    <Card className="w-full border border-dashed border-gray-300 bg-white/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <BookOpenCheck className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No courses in progress
        </h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Start learning from your courses or explore new ones to see them
          appear here.
        </p>
        <Button
          variant="outline"
          className="flex items-center gap-2"
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
  const tabs = ["MyCourses", "In Progress"];
  const { courses } = useCoursesActivity();
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
      } else {
        toast({
          title: "Error",
          description: "Failed to delete course",
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
  const navigate = useNavigate();

  const selectedStyle =
    "pb-2 text-lg cursor-pointer border-b-2  font-normal border-gray-800";
  const notSelectedStyle =
    "pb-2 text-lg cursor-pointer hover:border-b-2 font-light ";

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-4 w-full flex flex-row space-x-2">
        <div>
          <Library />
        </div>
        <h1 className="text-xl font-bold">Library</h1>
      </div>
      <div className="w-full flex flex-row space-x-4 mb-4">
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
      <div className="w-full">
        {courses?.map((course) => (
          <CourseListItem
            course={course}
            onDelete={() => {
              deleteCourse(course.course_id);
            }}
          />
        ))}
        {courses.length === 0 && selected === 0 && (
          <EmptyLibrary onCreateClick={() => navigate("/create")} />
        )}
        {courses.length === 0 && selected === 1 && <EmptyInProgress />}
      </div>
    </div>
  );
}

export default LibraryPage;
