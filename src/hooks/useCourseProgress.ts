import { CourseVideo } from "@/pages/ViewCourse";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { useEffect, useState } from "react";

// Course progress interface
interface StoredCourse extends CourseWithFirstVideo {
  lastViewed: string; // ISO date string
  lastVideoIndex: number;
  completedVideos: number[];
  watchedVideos: number[];
  videos?: CourseVideo[]; // Optional detailed video data
}

// Simple hook for course progress
export const useCourseProgress = () => {
  const [inProgressCourses, setInProgressCourses] = useState<StoredCourse[]>(
    []
  );

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("inProgressCourses");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInProgressCourses(parsed);
      } catch (error) {
        console.error(
          "Error parsing in-progress courses from localStorage:",
          error
        );
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (inProgressCourses.length > 0) {
      localStorage.setItem(
        "inProgressCourses",
        JSON.stringify(inProgressCourses)
      );
    }
  }, [inProgressCourses]);

  // Save or update a course and its progress
  const saveCourseProgress = (
    course: CourseWithFirstVideo,
    videoIndex: number,
    completedVideos: number[] = [],
    watchedVideos: number[] = [],
    videos?: CourseVideo[]
  ) => {
    setInProgressCourses((prev) => {
      // Check if course already exists
      const existingIndex = prev.findIndex(
        (c) => c.course_id === course.course_id
      );

      let updatedCourses;

      if (existingIndex >= 0) {
        // Update existing course
        const updatedCourse = {
          ...prev[existingIndex],
          ...course, // Update any course data that might have changed
          lastViewed: new Date().toISOString(),
          lastVideoIndex: videoIndex,
          completedVideos: completedVideos,
          watchedVideos: watchedVideos,
          videos: videos || prev[existingIndex].videos,
        };

        // Create a new array to ensure React detects the change
        updatedCourses = [...prev];
        updatedCourses[existingIndex] = updatedCourse;
      } else {
        // Add new course
        const newCourse = {
          ...course,
          lastViewed: new Date().toISOString(),
          lastVideoIndex: videoIndex,
          completedVideos: completedVideos,
          watchedVideos: watchedVideos,
          videos: videos,
        };

        updatedCourses = [...prev, newCourse];
      }

      // Immediately save to localStorage to ensure persistence
      localStorage.setItem("inProgressCourses", JSON.stringify(updatedCourses));

      return updatedCourses;
    });
  };

  // Get a specific in-progress course by ID
  const getCourseProgress = (courseId: string): StoredCourse | undefined => {
    return inProgressCourses.find((course) => course.course_id === courseId);
  };

  // Remove a course from in-progress list
  const removeCourseProgress = (courseId: string) => {
    setInProgressCourses((prev) =>
      prev.filter((course) => course.course_id !== courseId)
    );

    // If list becomes empty, remove item from localStorage
    if (inProgressCourses.length <= 1) {
      localStorage.removeItem("inProgressCourses");
    }
  };

  // Mark a video as completed
  const markVideoCompleted = (courseId: string, videoIndex: number) => {
    setInProgressCourses((prev) => {
      const courseIndex = prev.findIndex((c) => c.course_id === courseId);
      if (courseIndex < 0) return prev;

      const course = { ...prev[courseIndex] };

      // If not already in completed videos, add it
      if (!course.completedVideos.includes(videoIndex)) {
        course.completedVideos = [...course.completedVideos, videoIndex];
      }

      // Create updated array
      const updated = [...prev];
      updated[courseIndex] = course;
      return updated;
    });
  };

  // Mark a video as watched
  const markVideoWatched = (courseId: string, videoIndex: number) => {
    setInProgressCourses((prev) => {
      const courseIndex = prev.findIndex((c) => c.course_id === courseId);
      if (courseIndex < 0) return prev;

      const course = { ...prev[courseIndex] };

      // If not already in watched videos, add it
      if (!course.watchedVideos.includes(videoIndex)) {
        course.watchedVideos = [...course.watchedVideos, videoIndex];
      }

      // Create updated array
      const updated = [...prev];
      updated[courseIndex] = course;
      return updated;
    });
  };

  // Calculate completion percentage for a course
  // Calculate completion percentage for a course
  const getCompletionPercentage = (courseId: string): number => {
    const course = getCourseProgress(courseId);
    if (!course) return 0;

    const totalVideos = course.total_videos;

    // Count both watched and completed videos for progress
    // A video can be both watched and completed, so we need to get unique IDs
    const uniqueProgressVideos = new Set([
      ...(course.watchedVideos || []),
      ...(course.completedVideos || []),
    ]);

    const progressCount = uniqueProgressVideos.size;

    if (totalVideos === 0) return 0;
    return Math.round((progressCount / totalVideos) * 100);
  };

  return {
    inProgressCourses,
    saveCourseProgress,
    getCourseProgress,
    removeCourseProgress,
    markVideoCompleted,
    markVideoWatched,
    getCompletionPercentage,
  };
};
