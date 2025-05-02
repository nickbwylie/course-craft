// hooks/useCourses.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabaseconsant";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { useAuth } from "@/contexts/AuthContext";
import { SERVER } from "@/constants";
import { toast } from "./use-toast";

export function useUserCourses() {
  const { user } = useAuth();
  return useQuery<CourseWithFirstVideo[]>({
    queryKey: ["userCourses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase.rpc(
        "get_user_courses_with_first_video_and_duration",
        { user_id: user.id }
      );

      // filter to get the newest course first
      if (data) {
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useDeleteCourse() {
  // Get the QueryClient from the context
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Authentication required");
      }

      const res = await fetch(`${SERVER}/delete_course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete course");
      }

      return { courseId };
    },
    // When the mutation succeeds, invalidate the userCourses query
    onSuccess: () => {
      // Invalidate the userCourses query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["userCourses"] });

      // Show success toast
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    },
    // Handle errors
    onError: (error) => {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCoursePrivacy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      isPublic,
    }: {
      courseId: string;
      isPublic: boolean;
    }) => {
      const { data, error } = await supabase
        .from("courses")
        .update({ public: isPublic })
        .eq("id", courseId);

      if (error) {
        throw new Error(error.message);
      }

      return { courseId, isPublic, data };
    },
    // Optimistically update the UI
    onMutate: async ({ courseId, isPublic }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userCourses"] });

      // Get the current data
      const previousCourses = queryClient.getQueryData(["userCourses"]);

      // Optimistically update the cache
      queryClient.setQueryData(
        ["userCourses"],
        (old: CourseWithFirstVideo[] | undefined) => {
          if (!old) return [];

          return old.map((course) => {
            if (course.course_id === courseId) {
              return { ...course, public: isPublic };
            }
            return course;
          });
        }
      );

      // Return the previous data
      return { previousCourses };
    },
    // If the mutation fails, roll back
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userCourses"], context?.previousCourses);
      toast({
        title: "Error",
        description: "Failed to update course privacy",
        variant: "destructive",
      });
    },
    // When it succeeds, show a success message
    onSuccess: ({ isPublic }) => {
      toast({
        title: "Success",
        description: `Course is now ${isPublic ? "public" : "private"}`,
        variant: "default",
      });
    },
    // Always invalidate after settling
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userCourses"] });
    },
  });
}
