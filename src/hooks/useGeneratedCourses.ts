import { useQuery } from "@tanstack/react-query";
import { CourseWithFirstVideo } from "../types/CourseType.ts";
import { supabase } from "../supabaseconsant.ts";

export function useGeneratedCourses() {
  return useQuery<CourseWithFirstVideo[]>({
    queryKey: ["userGeneratedCourses"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_courses_with_first_video_and_duration"
      );

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 24 * 60 * 60 * 1, // 24 hours
  });
}
