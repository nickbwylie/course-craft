// hooks/useCourses.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabaseconsant";
import { CourseWithFirstVideo } from "@/types/CourseType";

export function useAdminCourses() {
  return useQuery<CourseWithFirstVideo[]>({
    queryKey: ["adminCourses"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_courses_with_first_video_and_duration"
      );

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
