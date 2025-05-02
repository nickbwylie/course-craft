import { supabase } from "@/supabaseconsant";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { CourseWithFirstVideo } from "@/types/CourseType";

interface CoursesActivityContextType {
  courses: CourseWithFirstVideo[]; // Adjust the type as necessary
  isLoading: boolean;
  getUserCourses: () => Promise<void>;
}

const CoursesActivityContext = createContext<
  CoursesActivityContextType | undefined
>(undefined);

export const CoursesActivityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [courses, setCourses] = useState<CourseWithFirstVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getUserCourses = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;

      const { data, error } = await supabase.rpc(
        "get_user_courses_with_first_video_and_duration",
        { user_id: user.id }
      );

      if (error) {
        console.error("Error fetching courses:", error);
        return;
      }

      if (data) {
        setCourses(data);
      }
    } catch (error) {
      console.error("Unexpected error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CoursesActivityContext.Provider
      value={{ courses, isLoading, getUserCourses }}
    >
      {children}
    </CoursesActivityContext.Provider>
  );
};

export const useCoursesActivity = (): CoursesActivityContextType => {
  const context = useContext(CoursesActivityContext);
  if (!context) {
    throw new Error(
      "useCoursesActivity must be used within a CoursesActivityProvider"
    );
  }
  return context;
};
