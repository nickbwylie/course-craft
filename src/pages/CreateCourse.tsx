import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaYoutube } from "react-icons/fa";
import {
  CheckCircle,
  Component,
  HelpCircle,
  MonitorPlay,
  Newspaper,
  Notebook,
  Plus,
  Settings,
  Sparkles,
  Trash,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Helpers and types
import {
  AddCourseRequest,
  createCourse,
  getYouTubeVideoData,
  YoutubeVideoPreview,
  calculateTotalDuration,
  getCourseTitleDescriptionFromYoutubeVideos,
  FailedToGetTranscripts,
  CourseCreationResponse,
} from "@/helperFunctions/youtubeVideo";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTracking } from "@/hooks/useTracking";
import { Helmet } from "react-helmet-async";
import ReorderableVideoList from "@/myComponents/ReorderableVideoList";
import { ScaledClick } from "@/animations/ScaledClick";
import { useSearchParams } from "react-router";
import lottie from "lottie-web";

import confettiAnimation from "../assets/confetti.json";
import { useUserInfo } from "@/hooks/useUserInfo";

// Form schema
const courseFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(60, { message: "Title must not be longer than 60 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(500, {
      message: "Description must not be longer than 500 characters.",
    }),
  courseDifficulty: z.string({
    required_error: "Please select the course difficulty.",
  }),
  courseDetail: z.string({
    required_error: "Please select the level of detail.",
  }),
  isPublic: z.boolean().default(true),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

// Main component
export default function CreateCoursePage() {
  // Form and state hooks
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      courseDifficulty: "Normal",
      courseDetail: "Normal",
      isPublic: false,
    },
  });

  const { user } = useAuth();
  const { data: userInfo } = useUserInfo();
  const [videoUrl, setVideoUrl] = useState("");
  const [courseVideos, setCourseVideos] = useState<YoutubeVideoPreview[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState("");
  const queryClient = useQueryClient();
  const { trackEvent } = useTracking();
  const [transcriptErrorVideos, setTranscriptErrorVideos] = useState<
    YoutubeVideoPreview[]
  >([]);
  const [showTranscriptErrorDialog, setShowTranscriptErrorDialog] =
    useState(false);

  // Calculate course stats
  const totalDuration = calculateTotalDuration(
    courseVideos.map((video) => video.duration)
  );
  const totalVideos = courseVideos.length;

  // Extract YouTube video ID from URL
  function extractYouTubeVideoId(url: string): string | null {
    try {
      const parsedUrl = new URL(url);

      if (
        parsedUrl.hostname === "www.youtube.com" ||
        parsedUrl.hostname === "youtube.com"
      ) {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.substring(1);
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Handle adding a video to the course
  async function handleAddVideo() {
    setAddVideoError("");
    if (!videoUrl.trim()) {
      setAddVideoError("Please enter a YouTube URL");
      return;
    }

    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      setAddVideoError("Invalid YouTube URL");
      return;
    }

    if (courseVideos.some((v) => v.videoId === videoId)) {
      setAddVideoError("This video is already in your course");
      return;
    }

    setIsAddingVideo(true);

    try {
      const videoData = await getYouTubeVideoData(videoId);
      if (!videoData) {
        setAddVideoError("Could not fetch video data");
        return;
      }

      setCourseVideos((prev) => [...prev, videoData]);
      setVideoUrl("");
    } catch (error) {
      console.error(error);
      setAddVideoError("Error adding video");
    } finally {
      setIsAddingVideo(false);
    }
  }

  const TranscriptErrorDialog = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800">
          {transcriptErrorVideos.length > 0 && (
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                Missing Transcripts Detected
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                CourseCraft requires videos to have captions to generate
                summaries and quizzes. Please remove these videos or replace
                them with videos that have captions:
              </AlertDialogDescription>
            </AlertDialogHeader>
          )}
          <div className="max-h-60 overflow-y-auto my-4 space-y-3">
            {transcriptErrorVideos.map((video) => (
              <div
                key={video.videoId}
                className="flex items-start gap-3 p-3 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
              >
                <div className="w-16 h-10 relative flex-shrink-0 overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-700">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                    {video.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {video.channel}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 p-1 h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => handleRemoveVideo(video.videoId)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {transcriptErrorVideos.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>All problematic videos have been removed.</p>
                <p className="text-sm mt-1">
                  You can now close this dialog and try submitting again.
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-900 border-gray-300 dark:border-gray-600">
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                // Remove all failed videos
                transcriptErrorVideos.forEach((video) =>
                  handleRemoveVideo(video.videoId)
                );
                onClose();
              }}
            >
              Remove All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const handleTranscriptErrors = (
    response: CourseCreationResponse | FailedToGetTranscripts,
    courseVideos: YoutubeVideoPreview[]
  ) => {
    if ("error" in response && response.failed_ids?.length > 0) {
      const failedIds = response.failed_ids;

      // Find the problematic videos to show their titles
      const failedVideos = courseVideos.filter((video) =>
        failedIds.includes(video.videoId)
      );

      if (failedVideos.length === 0) return false; // No matching videos found

      setIsSubmitting(false); // Make sure we're not in a loading state

      // Use setTimeout to ensure this happens after current state updates complete

      setTranscriptErrorVideos(failedVideos);
      setShowTranscriptErrorDialog(true);

      return true; // Error was handled
    }
    return false; // No error or not a transcript error
  };

  // Form submission
  async function onSubmit(data: CourseFormValues) {
    if (!user?.id) {
      toast({
        title: "Not signed in",
        description: "Please sign in to create a course",
        variant: "destructive",
      });
      return;
    }

    if (courseVideos.length === 0) {
      toast({
        title: "No videos added",
        description: "Please add at least one video to your course",
        variant: "destructive",
      });
      return;
    }

    if (isOverDurationLimit) {
      let durationLimit = 5;

      if (!userInfo || !userInfo?.paid) {
        durationLimit = 1;
      }
      toast({
        title: "Course too long",
        description: `Total course duration exceeds the maximum limit of ${durationLimit}. Please remove some videos.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    // Progress animation timer
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    try {
      const difficultyToNumber = {
        Simple: 1,
        Normal: 3,
        High: 5,
      } as const;

      const questionCount = {
        Simple: 1,
        Normal: 2,
        High: 3,
      } as const;

      const courseRequest: AddCourseRequest = {
        title: data.title,
        description: data.description,
        user_id: user.id,
        youtube_ids: courseVideos.map((video) => video.videoId),
        difficulty:
          difficultyToNumber[
            data.courseDifficulty as keyof typeof difficultyToNumber
          ],
        questionCount:
          questionCount[data.courseDetail as keyof typeof questionCount] || 2,
        summary_detail:
          difficultyToNumber[
            data.courseDetail as keyof typeof difficultyToNumber
          ] || 3,
        is_public: data.isPublic,
      };

      const response = await createCourse(courseRequest);

      if ((response as FailedToGetTranscripts)?.error) {
        handleTranscriptErrors(response, courseVideos);
        setIsSubmitting(false);
        clearInterval(timer);
        return;
      }

      // track event
      trackEvent("course_created", user?.id, {
        course_id: response.course_id,
        course_title: data.title,
        course_difficulty: data.courseDifficulty,
        course_detail: data.courseDetail,
        is_public: data.isPublic,
        amount_of_videos: courseVideos.length,
        video_length: totalDuration,
      });
      // update user courses cache
      queryClient.invalidateQueries({ queryKey: ["userCourses"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });

      setCreatedCourseId(response.course_id || "");

      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessModalOpen(true);
        form.reset();
      }, 500);
    } catch (error) {
      clearInterval(timer);
      // console.error(error);
      setIsSubmitting(false);
      console.log("error thrown", error.message);
      if (error && (error as Error)?.message) {
        toast({
          title: "Error creating course",
          description: (error as Error).message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Error creating course",
        description:
          "An error occurred while creating your course. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleReorderVideos = (reorderedVideos: string[]) => {
    const reorderedVideosData = reorderedVideos
      .map((videoId) => courseVideos.find((video) => video.videoId === videoId))
      .filter((video): video is YoutubeVideoPreview => !!video);

    setCourseVideos(reorderedVideosData);
  };

  function handleRemoveVideo(videoId: string) {
    setCourseVideos((prev) =>
      prev.filter((video) => video.videoId !== videoId)
    );
    setTranscriptErrorVideos((prev) =>
      prev.filter((video) => video.videoId !== videoId)
    );
  }

  async function generateTitleAndDescription(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (courseVideos.length === 0) return "";
    const youtubeVideoInfos = courseVideos.map((video) => {
      return { channel: video.channel, title: video.title };
    });

    const res = await getCourseTitleDescriptionFromYoutubeVideos(
      youtubeVideoInfos
    );

    if (res) {
      form.setValue("title", res.title, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("description", res.description, {
        shouldValidate: true,
        shouldDirty: true,
      });

      await form.trigger(["title", "description"]);
    }
  }

  const isOverDurationLimit = useMemo(() => {
    if (!totalDuration) return false;
    const [hours, minutes, seconds] = totalDuration.split(":").map(Number);

    if (!userInfo || (userInfo && !userInfo?.paid)) {
      // if the user is not paid
      return hours > 1;
    }
    return hours > 5;
  }, [totalDuration]);

  const pageTitle = "Create a Course - CourseCraft";
  const pageDescription =
    "Transform YouTube videos into structured learning experiences with AI-generated summaries and quizzes. Create custom courses on any topic.";

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    // ① show the toast
    toast({
      title: "Payment successful",
      description:
        "Thank you for your purchase! Your tokens have been added to your account.",
      variant: "success",
    });

    // ② clear the param so this effect won't fire again
    searchParams.delete("session_id");
    setSearchParams(searchParams, { replace: true });
    // empty deps → only runs once on mount
  }, []);

  const animationContainer = useRef(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Only load animation if dialog is open
    if (successModalOpen && animationContainer.current) {
      // Define the completion handler first so we can reference the same function
      const handleAnimationComplete = () => {
        setAnimationComplete(true);
      };

      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: false, // Change to false to allow completion
        autoplay: true,
        animationData: confettiAnimation,
      });

      // Add event listener with the named function
      anim.addEventListener("complete", handleAnimationComplete);

      // Clean up
      return () => {
        anim.removeEventListener("complete", handleAnimationComplete);
        anim.destroy();
        setAnimationComplete(false);
      };
    }
  }, [successModalOpen]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="create course, custom learning, AI education, YouTube learning"
        />
        <link rel="canonical" href="https://course-craft.tech/create" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://course-craft.tech/create" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />

        {/* Twitter */}
        <meta
          property="twitter:url"
          content="https://course-craft.tech/create"
        />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
      </Helmet>
      {/* Header */}
      <div className="mb-6 flex flex-row space-x-2 items-center">
        <Sparkles className="text-[#407e8b] dark:text-[#60a5fa] h-5 w-5" />
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Create a New Course
        </h1>
      </div>
      <div
        ref={animationContainer}
        className={`${
          successModalOpen ? "fixed left-[35%] top-[35%] w-64 h-64 z-[999]" : ""
        }`}
      />

      {/* Main form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Course form (left side) */}
            <div className="w-full space-y-6">
              {/* Course information section */}

              {/* Add videos section */}
              <div className="bg-white dark:bg-slate-800 dark:border-slate-700 p-6 rounded-lg border border-slate-200 hadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex flex-row gap-2 items-center">
                  <FaYoutube className="w-5 h-5" /> Add Videos
                </h2>

                <div className="mb-6">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FaYoutube className="h-5 w-5 text-red-600 dark:text-red-500" />
                      </div>
                      <Input
                        placeholder="Paste YouTube video URL here"
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          setAddVideoError("");
                        }}
                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddVideo();
                          }
                        }}
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      {/* <Button
                        onClick={handleAddVideo}
                        disabled={isAddingVideo || !videoUrl.trim()}
                        className="hidden sm:hidden bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark text-white"
                      >
                        {isAddingVideo ? "Adding..." : "Add Video"}
                      </Button> */}
                      <Button
                        onClick={handleAddVideo}
                        disabled={isAddingVideo || !videoUrl.trim()}
                        className="flex bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark text-white"
                      >
                        {isAddingVideo ? (
                          <Plus className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {addVideoError && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                      {addVideoError}
                    </p>
                  )}

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Add videos by pasting YouTube URLs (e.g.,
                    https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                  </p>
                </div>

                {/* Video list */}
                {courseVideos.length > 0 ? (
                  <div>
                    {courseVideos.length > 0 && (
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-slate-700 dark:text-slate-300">
                            Arrange Course Order
                          </h3>
                          {totalDuration && (
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Duration:{" "}
                              <span className="font-medium">
                                {totalDuration}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3 ">
                          <ReorderableVideoList
                            videos={courseVideos}
                            onReorder={handleReorderVideos}
                            onDelete={handleRemoveVideo}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center bg-slate-50 dark:bg-slate-900">
                    <MonitorPlay className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                    <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                      No videos added yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add videos by pasting YouTube URLs above
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex flex-row gap-2 items-center">
                  <Newspaper className="w-5 h-5" /> Course Information
                </h2>

                <div className="flex justify-end my-0">
                  <Button
                    variant="outline"
                    className="text-xs hover:bg-transparent border border-slate-300  hover:border-white flex flex-row gap-1 px-4 py-4"
                    disabled={courseVideos.length === 0}
                    onClick={generateTitleAndDescription}
                  >
                    <Component className="w-4 h-4 mr-1" />
                    Generate With AI
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-slate-700 dark:text-slate-300">
                        Course Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Introduction to Machine Learning"
                          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-slate-700 dark:text-slate-300">
                        Course Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what your course covers and what students will learn"
                          className="min-h-[100px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-cyan-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-700 dark:text-slate-300">
                          Make course public
                        </FormLabel>
                        <FormDescription className="text-slate-500 dark:text-slate-400">
                          Public courses will appear in explore page and will be
                          accessible to all users. Private courses are only
                          visible to you.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 dark:border-slate-700  p-6 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex flex-row gap-2 items-center">
                  <Settings className="w-5 h-5" /> Course Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseDifficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300">
                          Course Difficulty
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel className="font-normal flex items-center gap-1 cursor-help text-xs text-slate-500 dark:text-slate-400">
                                <HelpCircle className="h-3 w-3" />
                                What's this?
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              <p className="max-w-xs">
                                Difficulty setting affects the complexity of
                                quiz questions generated for your course.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl className="z-50">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              <SelectValue placeholder="Select difficulty level" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              <SelectItem value="Simple">Easy</SelectItem>
                              <SelectItem value="Normal">
                                Normal (Recommended)
                              </SelectItem>
                              <SelectItem value="High">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courseDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300">
                          Summary Detail Level
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel className="font-normal flex items-center gap-1 cursor-help text-xs text-slate-500 dark:text-slate-400">
                                <HelpCircle className="h-3 w-3" />
                                What's this?
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              <p className="max-w-xs">
                                Detail level controls the length and depth of
                                AI-generated summaries for each video.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              <SelectValue placeholder="Select level of detail" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                              <SelectItem value="Simple">Brief</SelectItem>
                              <SelectItem value="Normal">
                                Standard (Recommended)
                              </SelectItem>
                              <SelectItem value="High">
                                Comprehensive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Course summary sidebar (right side) */}
            <div className="w-full">
              <div className="sticky top-6 bg-white dark:bg-slate-800 dark:border-slate-700 p-6 rounded-lg border border-slate-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100 flex flex-row gap-2 items-center">
                  <Notebook className="w-5 h-5" /> Course Summary
                </h2>

                <div className="space-y-4">
                  {/* Course stats */}
                  <div className="flex items-center gap-3 bg-primary/10 dark:bg-primary/10 p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/0 dark:bg-primary-dark/90 flex items-center justify-center">
                      <MonitorPlay className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {totalVideos} {totalVideos === 1 ? "video" : "videos"}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {totalDuration === "00:00:00"
                          ? "No videos added"
                          : totalDuration}
                      </p>
                    </div>
                  </div>

                  {/* Selected settings */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Selected Settings
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                      >
                        {form.watch("courseDifficulty") || "Normal"} Difficulty
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                      >
                        {form.watch("courseDetail") || "Normal"} Detail
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          form.watch("isPublic")
                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 dark:border-green-800"
                            : "bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        }
                      >
                        {form.watch("isPublic") ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>

                  {/* Creation progress */}
                  {isSubmitting && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        Creating your course...
                      </p>
                      <Progress
                        value={progress}
                        className="h-2 bg-slate-200 dark:bg-slate-700"
                      >
                        <div
                          className="h-full bg-cyan-600 dark:bg-cyan-500"
                          style={{ width: `${progress}%` }}
                        />
                      </Progress>
                      <p className="text-xs text-right text-slate-500 dark:text-slate-400">
                        {progress}%
                      </p>
                    </div>
                  )}

                  {/* Create button */}
                  <ScaledClick
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full mt-4 cursor-pointer bg-primary hover:bg-[rgb(54,116,129)] dark:bg-primary dark:hover:bg-primary-dark text-white"
                      disabled={isSubmitting || courseVideos.length === 0}
                    >
                      {isSubmitting ? "Creating Course..." : "Create Course"}
                    </Button>
                  </ScaledClick>

                  {/* Validation notice */}
                  {courseVideos.length === 0 && (
                    <p className="text-xs text-center text-amber-600 dark:text-slate-400 mt-2">
                      Please add at least one video to create a course
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
      {/* Success dialog */}
      <AlertDialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
              Course Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-900">
              Your course has been created and is now available for learning.
              What would you like to do next?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction
              onClick={() =>
                (window.location.href = `/course/${createdCourseId}`)
              }
              className="w-full sm:w-auto"
              style={{ backgroundColor: "rgb(64,126,139)" }}
            >
              View My Course
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => (window.location.href = "/explore")}
              className="w-full sm:w-auto bg-slate-100 text-slate-900 hover:bg-slate-200"
            >
              Explore Courses
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TranscriptErrorDialog
        isOpen={showTranscriptErrorDialog}
        onClose={() => setShowTranscriptErrorDialog(false)}
      />
    </div>
  );
}
