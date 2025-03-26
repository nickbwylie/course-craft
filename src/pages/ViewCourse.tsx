import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseconsant";
import "./CoursePage.css";

import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Menu,
  Newspaper,
  Pencil,
  Play,
  Tv,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

import { parseYouTubeDuration } from "@/helperFunctions/youtubeVideo";
import Quiz, { QuizQuestion } from "../quiz/Quiz.tsx";
import { Json } from "supabase-types.ts";
import { useTheme } from "@/styles/useTheme";
import { darkTheme } from "@/styles/myTheme";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { useCourseProgress } from "@/hooks/useCourseProgress.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";

export interface CourseVideo {
  course_description: string;
  course_id: string;
  course_title: string;
  quiz: Json;
  video_summary: string;
  quiz_id: string;
  video_id: string;
  video_title: string;
  video_duration: string;
  youtube_id: string;
  course_difficulty: number;
  detaillevel: string;
  channel_thumbnail: string;
  channel_title: string;
  view_count: string;
  published_at: string;
}

// Parse summary text into formatted sections
const parseSummary = (text: string) => {
  if (!text) return [];

  const cleanedText = text.replaceAll("*", "");
  // Split the text by "###" marker to separate sections
  const sections = cleanedText.split("### ").filter(Boolean);

  // Map over sections to create JSX for each part
  return sections.map((section, index) => {
    // Split each section into the first line (heading) and the rest (content)
    const [heading, ...content] = section.split(/\n/);

    // Remove "Key Point X: " part from heading using regex
    const cleanedHeading = heading.replace(/Key Point \d+:\s*/, "").trim();

    return (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {cleanedHeading}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {content.join(" ").trim()}
        </p>
      </div>
    );
  });
};

const formatViewCount = (views: string) => {
  const numViews = Number(views); // Ensure it's a number

  if (numViews >= 1_000_000_000) {
    return (numViews / 1_000_000_000).toFixed(1).replace(".0", "") + "B";
  } else if (numViews >= 1_000_000) {
    return (numViews / 1_000_000).toFixed(1).replace(".0", "") + "M";
  } else if (numViews >= 1_000) {
    return (numViews / 1_000).toFixed(1).replace(".0", "") + "K";
  } else {
    return numViews.toString(); // Return as is for < 1,000
  }
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date().getTime();
  const past = new Date(dateString).getTime();
  const diffInMilliseconds = now - past; // Difference in milliseconds
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000); // Convert to seconds

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInWeek = 7 * secondsInDay;
  const secondsInMonth = 30 * secondsInDay; // Approximation
  const secondsInYear = 365 * secondsInDay; // Approximation

  if (diffInSeconds >= secondsInYear) {
    const years = Math.floor(diffInSeconds / secondsInYear);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= secondsInMonth) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= secondsInWeek) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= secondsInDay) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= secondsInHour) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= secondsInMinute) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }
};

export default function ViewCourse() {
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>();
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [showSummary, setShowSummary] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<number[]>([]);
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
  const [videoWatchTime, setVideoWatchTime] = useState<{
    [key: number]: number;
  }>({});
  const [showCompletionButton, setShowCompletionButton] = useState(false);

  const { id } = useParams();
  const { theme } = useTheme();
  const isDarkMode = theme === darkTheme;

  // Get course progress functions
  const {
    saveCourseProgress,
    getCourseProgress,
    markVideoCompleted: markVideoCompletedInStorage,
    markVideoWatched: markVideoWatchedInStorage,
  } = useCourseProgress();

  async function getCourseContent(courseId: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("filtered_course_details", {
        course_id: courseId,
      });

      console.log("Fetched course content:", data);

      if (data) {
        setCourseVideos(data);
      }

      if (error) {
        console.error("Error getting course content:", error);
      }
    } catch (e) {
      console.error("Unexpected error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getCourseContent(id);

      // Load saved progress if available
      const savedProgress = getCourseProgress(id);
      if (savedProgress) {
        // Restore video position and completion status
        setSelectedCourse(savedProgress.lastVideoIndex || 0);
        // Make sure we have default empty arrays if these properties don't exist
        setCompletedVideos(savedProgress.completedVideos || []);
        setWatchedVideos(savedProgress.watchedVideos || []);

        console.log("Loaded progress:", {
          lastVideoIndex: savedProgress.lastVideoIndex,
          watchedVideos: savedProgress.watchedVideos || [],
          completedVideos: savedProgress.completedVideos || [],
        });
      } else {
        // Reset to defaults if no saved progress
        setSelectedCourse(0);
        setCompletedVideos([]);
        setWatchedVideos([]);
      }
    }
  }, [id]);

  // Load watch times from localStorage on component mount
  useEffect(() => {
    const savedWatchTimes = localStorage.getItem("videoWatchTimes");
    if (savedWatchTimes) {
      try {
        setVideoWatchTime(JSON.parse(savedWatchTimes));
      } catch (e) {
        console.error("Error parsing watch times:", e);
      }
    }
  }, []);

  // Save watch time to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("videoWatchTimes", JSON.stringify(videoWatchTime));
  }, [videoWatchTime]);

  // Timer effect for tracking watch time and showing completion button
  useEffect(() => {
    // Reset the completion button visibility when changing videos
    setShowCompletionButton(false);

    let watchTimer: NodeJS.Timeout | null = null;

    // If video is already watched or completed, show completion button immediately
    if (
      watchedVideos.includes(selectedCourse) ||
      completedVideos.includes(selectedCourse)
    ) {
      setShowCompletionButton(true);
      return () => {}; // Return empty cleanup since we don't need timers
    }

    // Only start timer if video isn't already watched or completed
    if (courseVideos) {
      // Check if we've already accumulated some watch time for this video
      const currentWatchTime = videoWatchTime[selectedCourse] || 0;

      if (currentWatchTime < 30) {
        // Start timer to mark as watched after 30 seconds
        const timeToWatch = 30 - currentWatchTime;

        watchTimer = setTimeout(() => {
          // Mark as watched
          const newWatchedVideos = [...watchedVideos, selectedCourse];
          setWatchedVideos(newWatchedVideos);

          // Show completion button
          setShowCompletionButton(true);

          // Update localStorage
          if (id) {
            console.log("Marking video as watched in storage:", selectedCourse);
            markVideoWatchedInStorage(id, selectedCourse);
            markVideoCompletedInStorage(id, selectedCourse);
          }

          // Immediately save watch time to localStorage
          const updatedWatchTime = { ...videoWatchTime, [selectedCourse]: 30 };
          setVideoWatchTime(updatedWatchTime);
          localStorage.setItem(
            "videoWatchTimes",
            JSON.stringify(updatedWatchTime)
          );
        }, timeToWatch * 1000);
      }
    }

    // Track video watch time using an interval
    const watchTimeInterval = setInterval(() => {
      setVideoWatchTime((prev) => {
        const updated = {
          ...prev,
          [selectedCourse]: (prev[selectedCourse] || 0) + 1,
        };
        // Save to localStorage on each update to ensure persistence
        localStorage.setItem("videoWatchTimes", JSON.stringify(updated));
        return updated;
      });
    }, 1000);

    // Clean up timers
    return () => {
      if (watchTimer) clearTimeout(watchTimer);
      clearInterval(watchTimeInterval);
    };
  }, [selectedCourse, watchedVideos, completedVideos, id, courseVideos]);

  const safeGetLocalStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(`Error loading from localStorage for key ${key}:`, e);
    }
    return defaultValue;
  };

  // Then replace the localStorage initialization code with:
  useEffect(() => {
    setVideoWatchTime(safeGetLocalStorage("videoWatchTimes", {}));
  }, []);

  // Save course progress to localStorage whenever tracked states change
  useEffect(() => {
    if (id && courseVideos && courseVideos.length > 0) {
      // Create course metadata for localStorage
      const courseData: CourseWithFirstVideo = {
        course_id: id,
        course_title: courseVideos[0]?.course_title || "",
        course_description: courseVideos[0]?.course_description || "",
        thumbnail_url: `https://img.youtube.com/vi/${courseVideos[0]?.youtube_id}/hqdefault.jpg`,
        created_at: new Date().toISOString(),
        total_duration: calculateTotalDuration(courseVideos),
        total_videos: courseVideos.length,
        public: true, // Default value
        course_difficulty: courseVideos[0].course_difficulty,
        detaillevel: courseVideos[0].detaillevel,
        video_id: courseVideos[0].video_id,
        video_title: courseVideos[0].video_title,
      };

      // Save/update progress
      saveCourseProgress(
        courseData,
        selectedCourse,
        completedVideos,
        watchedVideos,
        courseVideos
      );
    }
  }, [id, selectedCourse, completedVideos, watchedVideos, courseVideos]);

  // Calculate total duration for all videos
  const calculateTotalDuration = (videos: CourseVideo[]): string => {
    let totalSeconds = 0;

    videos.forEach((video) => {
      const duration = video.video_duration;
      const [hours, minutes, seconds] = duration.split(":").map(Number);
      totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle navigation between videos
  const goToNextVideo = () => {
    if (!courseVideos) return;
    setSelectedCourse((prev) => (prev + 1) % courseVideos.length);
  };

  const goToPreviousVideo = () => {
    if (!courseVideos) return;
    setSelectedCourse((prev) =>
      prev <= 0 ? courseVideos.length - 1 : prev - 1
    );
  };

  // Get current video data
  const currentVideo =
    courseVideos && courseVideos.length > selectedCourse
      ? courseVideos[selectedCourse]
      : null;

  useEffect(() => {
    // Function to save all current progress data
    const saveAllProgress = () => {
      if (id && courseVideos && courseVideos.length > 0) {
        // ... save progress logic ...
      }
    };

    // Save on beforeunload event
    const handleBeforeUnload = () => {
      saveAllProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Save every 30 seconds as backup
    const autoSaveInterval = setInterval(saveAllProgress, 30000);

    // Clean up listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(autoSaveInterval);

      // Also save on component unmount
      saveAllProgress();
    };
  }, [
    id,
    courseVideos,
    selectedCourse,
    completedVideos,
    watchedVideos,
    videoWatchTime,
  ]);

  return (
    <div className="flex flex-col max-w-5xl mx-auto min-h-screen">
      {/* Mobile Navigation Button */}
      <div className="lg:hidden fixed top-4 right-8 z-50">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white hover:bg-white dark:bg-slate-800 shadow-md border-slate-200 dark:border-slate-700"
            >
              <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-80 sm:w-96 p-0 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                Course Content
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {courseVideos ? `${courseVideos.length} videos` : "Loading..."}
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-80px)] p-4">
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-4">
                        <Skeleton className="h-16 w-full mb-2 dark:bg-slate-700" />
                      </div>
                    ))
                : courseVideos?.map((courseVideo, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedCourse(index);
                        setIsMobileNavOpen(false);
                      }}
                      className={`flex items-start p-3 mb-2 rounded-lg cursor-pointer ${
                        index === selectedCourse
                          ? "bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3 relative">
                        {index === selectedCourse && (
                          <div className="absolute inset-0 bg-cyan-500/30 rounded flex items-center justify-center">
                            <img
                              src={`https://img.youtube.com/vi/${courseVideo?.youtube_id}/hqdefault.jpg`}
                              alt="Video Thumbnail"
                              className="absolute inset-0 w-full h-full object-cover opacity-50"
                            />
                          </div>
                        )}
                        <div className="w-20 h-12 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden flex items-center justify-center">
                          <img
                            src={`https://img.youtube.com/vi/${courseVideo?.youtube_id}/hqdefault.jpg`}
                            alt="Video Thumbnail"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-sm ${
                            index === selectedCourse
                              ? "font-medium text-slate-800 dark:text-slate-200"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {courseVideo.video_title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500 mr-1" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {parseYouTubeDuration(courseVideo.video_duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Course Header */}
      <div className="px-4 md:px-8 py-6 mb-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semi-bold text-slate-800 dark:text-slate-200">
            {isLoading ? (
              <Skeleton className="h-8 w-3/4 dark:bg-slate-700" />
            ) : (
              courseVideos && courseVideos[0]?.course_title
            )}
          </h1>

          {/* Desktop theme toggle */}
          <div className="hidden lg:flex"></div>
        </div>

        {isLoading ? (
          <Skeleton className="h-4 w-1/2 dark:bg-slate-700" />
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"></div>
        )}
      </div>

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 hidden lg:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[calc(100vh-145px)]"
        >
          {/* Left Content Area - Video and Tabs */}
          <ResizablePanel defaultSize={65} minSize={40} className="relative">
            <div className="px-8 pt-4 md:px-8 pb-8 relative">
              {/* Video Container */}
              <div className="relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video mb-6">
                {isLoading || !currentVideo ? (
                  <Skeleton className="w-full h-full bg-slate-800 dark:bg-slate-700" />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?rel=0&modestbranding=1&showinfo=0&autohide=1`}
                    title={currentVideo.video_title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* Video Title and Navigation */}
              <div className="flex flex-col sm:flex-col sm:items-center justify-start mb-6 text-start">
                <div className="w-full mb-4 sm:mb-4">
                  {isLoading || !currentVideo ? (
                    <>
                      <Skeleton className="h-6 w-64 mb-2 dark:bg-slate-700" />
                      <Skeleton className="h-4 w-40 dark:bg-slate-700" />
                    </>
                  ) : (
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {currentVideo.video_title}
                    </h2>
                  )}
                </div>

                <div className="flex flex-row w-full items-center justify-between gap-4 mb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center text-start mt-1 truncate">
                    <Avatar className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center overflow-clip mr-3 border dark:border-white bg-gray-700">
                      <AvatarImage src={currentVideo?.channel_thumbnail} />
                      <AvatarFallback>
                        <div className="bg-gray-400 w-full"></div>
                      </AvatarFallback>
                    </Avatar>{" "}
                    <div className="flex flex-col">
                      <div className="font-normal dark:text-slate-300 text-slate-800">
                        {currentVideo?.channel_title}
                      </div>
                      <div className="text-xs">
                        {currentVideo?.view_count &&
                          `${formatViewCount(currentVideo.view_count)} - `}
                        {currentVideo?.published_at &&
                          formatTimeAgo(currentVideo.published_at)}
                      </div>
                    </div>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousVideo}
                      disabled={isLoading || !courseVideos}
                      className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      onClick={goToNextVideo}
                      disabled={isLoading || !courseVideos}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="mb-6 grid grid-cols-2 w-full md:w-auto bg-slate-100 dark:bg-slate-600">
                    <TabsTrigger
                      value="summary"
                      className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm rounded-md"
                      onClick={() => setShowSummary(true)}
                    >
                      <Newspaper className="h-5 w-5 mr-1 text-slate-900 dark:text-slate-100" />
                      Summary
                    </TabsTrigger>
                    <TabsTrigger
                      value="quiz"
                      className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm rounded-md"
                      onClick={() => setShowSummary(false)}
                    >
                      <Pencil className="h-5 w-5 mr-1 text-slate-900 dark:text-slate-100" />
                      Quiz
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-0">
                    {isLoading || !currentVideo ? (
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="mb-6">
                            <Skeleton className="h-6 w-48 mb-2 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-full mb-1 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-full mb-1 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-3/4 dark:bg-slate-700" />
                          </div>
                        ))
                    ) : (
                      <div className="prose prose-sm w-full">
                        {parseSummary(currentVideo.video_summary)}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-0">
                    {isLoading || !currentVideo ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-full dark:bg-slate-700" />
                        <Skeleton className="h-24 w-full dark:bg-slate-700" />
                        <Skeleton className="h-24 w-full dark:bg-slate-700" />
                      </div>
                    ) : (
                      <div className="border border-slate-100 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                        {/* Assuming Quiz is a component defined elsewhere */}
                        {currentVideo.quiz && (
                          <Quiz key={selectedCourse} quiz={currentVideo.quiz} />
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Right Sidebar - Course Modules */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col border-l border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                  Course Content
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {courseVideos
                    ? `${courseVideos.length} videos`
                    : "Loading..."}
                </p>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  {isLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="mb-4">
                          <Skeleton className="h-16 w-full mb-2 dark:bg-slate-700" />
                        </div>
                      ))
                  ) : (
                    <div className="space-y-2">
                      {courseVideos?.map((courseVideo, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedCourse(index)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            index === selectedCourse
                              ? "bg-[#407e8b14] dark:bg-[#407e8b40]"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                {index < selectedCourse ? (
                                  <CheckCircle className="h-5 w-5 text-cyan-700 dark:text--500" />
                                ) : index === selectedCourse ? (
                                  <div className="bg-cyan-100 dark:bg-cyan-800 rounded-full p-1.5">
                                    <Play className="h-4 w-4 text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400" />
                                  </div>
                                ) : (
                                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {index + 1}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`text-sm ${
                                  index === selectedCourse
                                    ? "font-medium text-slate-800 dark:text-slate-200"
                                    : "text-slate-700 dark:text-slate-300"
                                } line-clamp-2`}
                              >
                                {courseVideo.video_title}
                              </h4>
                              <div className="flex items-center mt-1">
                                <Tv className="h-3 w-3 text-slate-400 dark:text-slate-500 mr-1" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {parseYouTubeDuration(
                                    courseVideo.video_duration
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {index === selectedCourse && (
                            <div className="mt-2 pl-11">
                              <div className="flex gap-2">
                                <Badge
                                  variant={showSummary ? "default" : "outline"}
                                  className={`text-xs ${
                                    showSummary
                                      ? "bg-cyan-600 text-white hover:bg-cyan-500"
                                      : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSummary(true);
                                  }}
                                >
                                  Summary
                                </Badge>
                                <Badge
                                  variant={!showSummary ? "default" : "outline"}
                                  className={`text-xs ${
                                    !showSummary
                                      ? "bg-cyan-600 text-white hover:bg-cyan-500"
                                      : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowSummary(false);
                                  }}
                                >
                                  Quiz
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout (non-resizable) */}
      <div className="flex-1 lg:hidden flex flex-col">
        <div className="px-4 md:px-8 pt-4 pb-8">
          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video mb-6">
            {isLoading || !currentVideo ? (
              <Skeleton className="w-full h-full bg-slate-800 dark:bg-slate-700" />
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?rel=0&modestbranding=1&showinfo=0&autohide=1`}
                title={currentVideo.video_title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* Video Title and Navigation */}
          <div className="flex flex-col justify-start mb-6 text-start">
            <div className="w-full mb-4">
              {isLoading || !currentVideo ? (
                <>
                  <Skeleton className="h-6 w-64 mb-2 dark:bg-slate-700" />
                  <Skeleton className="h-4 w-40 dark:bg-slate-700" />
                </>
              ) : (
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {currentVideo.video_title}
                </h2>
              )}
            </div>

            <div className="flex flex-row w-full items-center justify-between gap-4 mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center text-start mt-1 truncate">
                <Avatar className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center overflow-clip mr-3 border dark:border-white  bg-gray-700">
                  <AvatarImage src={currentVideo?.channel_thumbnail} />
                  <AvatarFallback>
                    <div className="bg-gray-400 w-full"></div>
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-normal dark:text-slate-300 text-slate-800">
                    {currentVideo?.channel_title}
                  </div>
                  <div className="text-xs">
                    {currentVideo?.view_count &&
                      `${formatViewCount(currentVideo.view_count)} - `}
                    {currentVideo?.published_at &&
                      formatTimeAgo(currentVideo.published_at)}
                  </div>
                </div>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousVideo}
                  disabled={isLoading || !courseVideos}
                  className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={goToNextVideo}
                  disabled={isLoading || !courseVideos}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="mb-6 grid grid-cols-2 w-full bg-slate-100 dark:bg-slate-600">
                <TabsTrigger
                  value="summary"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm rounded-md"
                  onClick={() => setShowSummary(true)}
                >
                  <Newspaper className="h-5 w-5 mr-1 text-slate-900 dark:text-slate-100" />
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="quiz"
                  className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm rounded-md"
                  onClick={() => setShowSummary(false)}
                >
                  <Pencil className="h-5 w-5 mr-1 text-slate-900 dark:text-slate-100" />
                  Quiz
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-0">
                {isLoading || !currentVideo ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="mb-6">
                        <Skeleton className="h-6 w-48 mb-2 dark:bg-slate-700" />
                        <Skeleton className="h-4 w-full mb-1 dark:bg-slate-700" />
                        <Skeleton className="h-4 w-full mb-1 dark:bg-slate-700" />
                        <Skeleton className="h-4 w-3/4 dark:bg-slate-700" />
                      </div>
                    ))
                ) : (
                  <div className="prose prose-sm w-full">
                    {parseSummary(currentVideo.video_summary)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                {isLoading || !currentVideo ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full dark:bg-slate-700" />
                    <Skeleton className="h-24 w-full dark:bg-slate-700" />
                    <Skeleton className="h-24 w-full dark:bg-slate-700" />
                  </div>
                ) : (
                  <div className="border border-slate-100 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                    {currentVideo.quiz && (
                      <Quiz
                        key={selectedCourse}
                        quiz={currentVideo.quiz as QuizQuestion[]}
                      />
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
