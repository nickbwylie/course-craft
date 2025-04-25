import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  Share,
  Tv,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  calculateTotalDuration,
  parseYouTubeDuration,
} from "@/helperFunctions/youtubeVideo";
import Quiz, { QuizQuestion } from "../quiz/Quiz.tsx";
import { Json } from "supabase-types.ts";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { useCourseProgress } from "@/hooks/useCourseProgress.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { SpeechButton } from "@/myComponents/Speak.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { Helmet } from "react-helmet-async";
import { ScaledClick } from "@/animations/ScaledClick";
import YouTubeCourseVideo from "@/myComponents/YoutubeCourseVideo.tsx";
import { useMediaQuery } from "react-responsive";

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
  public: boolean;
  author_id: string;
}

const cleanedSummary = (text: string) => {
  if (!text) return "";

  let textOutput: string = "";

  const cleanedText = text.replaceAll("*", "");
  // Split the text by "###" marker to separate sections
  const sections = cleanedText.split("### ").filter(Boolean);

  // Map over sections to create JSX for each part
  sections.map((section, index) => {
    // Split each section into the first line (heading) and the rest (content)
    const [heading, ...content] = section.split(/\n/);

    // Remove "Key Point X: " part from heading using regex
    const cleanedHeading = heading.replace(/Key Point \d+:\s*/, "").trim();

    textOutput += cleanedHeading + "\n" + content.join(" ").trim() + "\n\n";

    return "";
  });
  return textOutput;
};
// Parse summary text into formatted sections
const parseSummary = (text: string, authenticated?: boolean) => {
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

    if (index === 0 && authenticated) {
      return (
        <div key={index} className="mb-6">
          <div className="flex flex-row justify-between items-center w-full">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {cleanedHeading}
            </h3>
            <div className="flex ml-2 mb-2">
              <SpeechButton textContent={cleanedSummary(text)} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {content.join(" ").trim()}
          </p>
        </div>
      );
    }
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
  const { user } = useAuth();
  const { id } = useParams();

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

      if (data) {
        const sortedByOrder = data.sort((a, b) => {
          return a.order_by - b.order_by;
        });
        setCourseVideos(sortedByOrder);
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

  async function incrementViewCount(courseId: string) {
    try {
      const { data, error } = await supabase.rpc("increment_view_count", {
        course_id: courseId,
      });

      if (error) {
        console.error("Error incrementing view count:", error);
        return;
      }
    } catch (e) {
      console.error("Error incrementing view count:", e);
    }
  }

  const handleShareCourse = async () => {
    const shareUrl = window.location.href;
    const shareTitle =
      courseVideos?.[0]?.course_title || "Check out this course";
    const shareText =
      courseVideos?.[0]?.course_description ||
      "I found this interesting course on CourseCraft";

    try {
      // Try using the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getCourseContent(id);
      incrementViewCount(id);

      // Load saved progress if available
      const savedProgress = getCourseProgress(id);
      if (savedProgress) {
        // Restore video position and completion status
        setSelectedCourse(savedProgress.lastVideoIndex || 0);
        // Make sure we have default empty arrays if these properties don't exist
        setCompletedVideos(savedProgress.completedVideos || []);
        setWatchedVideos(savedProgress.watchedVideos || []);
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
        thumbnail_url: `https://img.youtube.com/vi/${courseVideos[0]?.youtube_id}/maxresdefault.jpg`,
        created_at: new Date().toISOString(),
        total_duration: calculateTotalDuration(
          courseVideos.map((v) => {
            return v.video_duration;
          })
        ),
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

  const parsedSummary = useMemo(() => {
    return currentVideo ? (
      parseSummary(currentVideo.video_summary, !!user)
    ) : (
      <></>
    );
    // update when video changes or when user authentication state changes
  }, [user?.id, currentVideo?.video_summary]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && courseVideos && courseVideos?.length > 0) {
      if (!courseVideos[0].public && courseVideos[0].author_id !== user.id) {
        navigate("/explore");
      }
    }

    // if course is not public and user is not signed in
    if (!user && courseVideos && courseVideos?.length > 0) {
      if (!courseVideos[0].public) {
        navigate("/explore");
      }
    }
  }, [user, courseVideos?.length]);

  const pageTitle = currentVideo
    ? `${currentVideo.course_title} - CourseCraft`
    : "Learning - CourseCraft";

  const pageDescription =
    currentVideo?.course_description ||
    "Learn at your own pace with structured content, summaries, and knowledge checks.";

  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <>
      <div className="flex flex-col max-w-7xl mx-auto min-h-screen">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta
            name="keywords"
            content="online course, learning, education, custom course"
          />
          <link
            rel="canonical"
            href={`https://course-craft.tech/course/${id}`}
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content={`https://course-craft.tech/course/${id}`}
          />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />

          {/* Twitter */}
          <meta
            property="twitter:url"
            content={`https://course-craft.tech/course/${id}`}
          />
          <meta property="twitter:title" content={pageTitle} />
          <meta property="twitter:description" content={pageDescription} />
        </Helmet>
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
                  {courseVideos
                    ? `${courseVideos.length} videos`
                    : "Loading..."}
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
                            ? "bg-primary/20 dark:bg-primary/10 border border-primary-light dark:border-primary-dark"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex-shrink-0 mr-3 relative">
                          {index === selectedCourse && (
                            <div className="absolute inset-0 bg-primary/30 rounded flex items-center justify-center">
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
        <div className="px-4 md:px-8 py-6 mb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
              {isLoading ? (
                <Skeleton className="h-8 w-3/4 dark:bg-slate-700" />
              ) : (
                courseVideos && courseVideos[0]?.course_title
              )}
            </h1>
          </div>
        </div>

        {/* Main Content Area with Resizable Panels */}
        <div className="flex-1 lg:block">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[calc(100vh-145px)]"
          >
            {/* Left Content Area - Video and Tabs */}
            <ResizablePanel
              defaultSize={isDesktop ? 70 : 100}
              minSize={isDesktop ? 55 : 100}
              className="relative"
            >
              <div className="px-8 pt-4 md:px-8 pb-8 relative">
                {/* Video Container */}
                <div className="relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video mb-6">
                  {isLoading || !currentVideo ? (
                    <Skeleton className="w-full h-full bg-slate-800 dark:bg-slate-700" />
                  ) : (
                    <YouTubeCourseVideo
                      key={`desktop-${currentVideo.youtube_id}`}
                      videoId={currentVideo.youtube_id}
                    />
                  )}
                </div>

                {/* Video Title and Controls Section */}
                <div className="mb-6">
                  {/* Title and Share Button */}
                  <div className="flex justify-between items-start mb-4">
                    {isLoading || !currentVideo ? (
                      <Skeleton className="h-6 w-3/4 dark:bg-slate-700" />
                    ) : (
                      <div className="w-full flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                          {currentVideo.video_title}
                        </h2>
                        <ScaledClick
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShareCourse}
                            className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full"
                          >
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </ScaledClick>
                      </div>
                    )}

                    {/* {!isLoading && currentVideo && (
                      <ScaledClick
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShareCourse}
                          className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full"
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </ScaledClick>
                    )} */}
                  </div>

                  {/* Creator Info and Navigation Controls */}
                  <div className="flex items-center justify-between">
                    {/* Channel Information */}
                    <div className="flex items-center space-x-3">
                      {isLoading || !currentVideo ? (
                        <Skeleton className="h-10 w-10 rounded-full dark:bg-slate-700" />
                      ) : (
                        <Avatar className="flex-shrink-0 h-10 w-10 rounded-full border dark:border-slate-700 overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <AvatarImage src={currentVideo?.channel_thumbnail} />
                          <AvatarFallback>
                            <div className="bg-gray-400 w-full h-full"></div>
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col">
                        {isLoading || !currentVideo ? (
                          <>
                            <Skeleton className="h-4 w-40 mb-1 dark:bg-slate-700" />
                            <Skeleton className="h-3 w-24 dark:bg-slate-700" />
                          </>
                        ) : (
                          <>
                            <span className="font-medium dark:text-slate-200">
                              {currentVideo?.channel_title}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {currentVideo?.view_count &&
                                `${formatViewCount(
                                  currentVideo.view_count
                                )} views • `}
                              {currentVideo?.published_at &&
                                formatTimeAgo(currentVideo.published_at)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                      <ScaledClick
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousVideo}
                          disabled={isLoading || !courseVideos}
                          className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span className="hidden sm:block">Previous</span>
                        </Button>
                      </ScaledClick>
                      <ScaledClick
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="sm"
                          onClick={goToNextVideo}
                          disabled={isLoading || !courseVideos}
                          className="bg-primary hover:bg-primary-dark text-white"
                        >
                          <span className="hidden sm:block">Next</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </ScaledClick>
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
                        <Newspaper className="h-5 w-5 mr-2 text-slate-900 dark:text-slate-100" />
                        Summary
                      </TabsTrigger>
                      <TabsTrigger
                        value="quiz"
                        className="text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm rounded-md"
                        onClick={() => setShowSummary(false)}
                      >
                        <Pencil className="h-5 w-5 mr-2 text-slate-900 dark:text-slate-100" />
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
                          {parsedSummary}
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
                              quiz={currentVideo.quiz}
                            />
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            {isDesktop && (
              <>
                <ResizableHandle
                  withHandle
                  className="hidden lg:flex h-screen items-center justify-center"
                />
                <ResizablePanel
                  defaultSize={30}
                  minSize={20}
                  className="hidden lg:flex flex-col border-l border-slate-200 dark:border-slate-700"
                >
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
                                    ? "bg-[#407e8b14] dark:bg-primary/20"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mr-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                      {index < selectedCourse ? (
                                        <CheckCircle className="h-5 w-5 text-primary/50 dark:text-primary/50" />
                                      ) : index === selectedCourse ? (
                                        <div className="bg-primary/40 dark:bg-primary/40 rounded-full p-1.5">
                                          <Play className="h-4 w-4 text-primary dark:primary/10 fill-primary/70 dark:fill-primary" />
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
                                        variant={
                                          showSummary ? "default" : "outline"
                                        }
                                        className={`text-xs cursor-default ${
                                          showSummary
                                            ? "bg-primary/70 text-white"
                                            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                                        }`}
                                      >
                                        Summary
                                      </Badge>
                                      <Badge
                                        variant={
                                          !showSummary ? "default" : "outline"
                                        }
                                        className={`text-xs cursor-default ${
                                          !showSummary
                                            ? "bg-primary/70 text-white"
                                            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                                        }`}
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
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </>
  );
}
