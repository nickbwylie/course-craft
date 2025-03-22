import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaYoutube } from "react-icons/fa";
import {
  CheckCircle,
  HelpCircle,
  MonitorPlay,
  Sparkles,
  Trash,
} from "lucide-react";

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
  parseYouTubeDuration,
} from "@/helperFunctions/youtubeVideo";
import { useAuth } from "@/contexts/AuthContext";

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
  const [videoUrl, setVideoUrl] = useState("");
  const [courseVideos, setCourseVideos] = useState<YoutubeVideoPreview[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState("");

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

  // Handle removing a video from the course
  function handleRemoveVideo(videoId: string) {
    setCourseVideos((prev) =>
      prev.filter((video) => video.videoId !== videoId)
    );
  }

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
      setCreatedCourseId(response.body.course_id || "");

      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessModalOpen(true);
      }, 500);
    } catch (error) {
      clearInterval(timer);
      console.error(error);
      setIsSubmitting(false);

      toast({
        title: "Error creating course",
        description:
          "An error occurred while creating your course. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="mb-4 flex flex-row space-x-2 items-center">
        <Sparkles className="text-[#407e8b] dark:text-[#60a5fa] h-5 w-5" />
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Create a New Course
        </h1>
      </div>

      {/* Main form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Course form (left side) */}
            <div className="w-full space-y-6">
              {/* Course information section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Course Information
                </h2>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Course Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Introduction to Machine Learning"
                          className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
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
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Course Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what your course covers and what students will learn"
                          className="min-h-[100px] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
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
                          className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-cyan-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Make course public
                        </FormLabel>
                        <FormDescription className="text-gray-500 dark:text-gray-400">
                          Public courses will appear in explore page and will be
                          accessible to all users. Private courses are only
                          visible to you.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Add videos section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Add Videos
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
                        className="pl-10 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddVideo();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddVideo}
                      disabled={isAddingVideo || !videoUrl.trim()}
                      className="bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)] dark:bg-[rgb(74,136,149)] dark:hover:bg-[rgb(84,146,159)] text-white"
                    >
                      {isAddingVideo ? "Adding..." : "Add Video"}
                    </Button>
                  </div>

                  {addVideoError && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                      {addVideoError}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Add videos by pasting YouTube URLs (e.g.,
                    https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                  </p>
                </div>

                {/* Video list */}
                {courseVideos.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        Course Videos ({courseVideos.length})
                      </h3>
                      {courseVideos.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to remove all videos?"
                              )
                            ) {
                              setCourseVideos([]);
                            }
                          }}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {courseVideos.map((video) => (
                        <div
                          key={video.videoId}
                          className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <div className="w-24 h-16 relative flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover rounded"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs py-0.5 px-1 rounded">
                              {parseYouTubeDuration(video.duration)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1 text-gray-800 dark:text-gray-200">
                              {video.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {video.channel}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"
                            onClick={() => handleRemoveVideo(video.videoId)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900">
                    <MonitorPlay className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                      No videos added yet
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add videos by pasting YouTube URLs above
                    </p>
                  </div>
                )}
              </div>

              {/* Settings section */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Course Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="courseDifficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Course Difficulty
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel className="font-normal flex items-center gap-1 cursor-help text-xs text-gray-500 dark:text-gray-400">
                                <HelpCircle className="h-3 w-3" />
                                What's this?
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                              <p className="max-w-xs">
                                Difficulty setting affects the complexity of
                                quiz questions generated for your course.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                              <SelectValue placeholder="Select difficulty level" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Summary Detail Level
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <FormLabel className="font-normal flex items-center gap-1 cursor-help text-xs text-gray-500 dark:text-gray-400">
                                <HelpCircle className="h-3 w-3" />
                                What's this?
                              </FormLabel>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
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
                            <SelectTrigger className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                              <SelectValue placeholder="Select level of detail" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
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
              <div className="sticky top-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Course Summary
                </h2>

                <div className="space-y-4">
                  {/* Course stats */}
                  <div className="flex items-center gap-3 bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-800 flex items-center justify-center">
                      <MonitorPlay className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {totalVideos} {totalVideos === 1 ? "video" : "videos"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {totalDuration === "00:00:00"
                          ? "No videos added"
                          : totalDuration}
                      </p>
                    </div>
                  </div>

                  {/* Selected settings */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Selected Settings
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      >
                        {form.watch("courseDifficulty") || "Normal"} Difficulty
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      >
                        {form.watch("courseDetail") || "Normal"} Detail
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          form.watch("isPublic")
                            ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 dark:border-green-800"
                            : "bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        }
                      >
                        {form.watch("isPublic") ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>

                  {/* Creation progress */}
                  {isSubmitting && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Creating your course...
                      </p>
                      <Progress
                        value={progress}
                        className="h-2 bg-gray-200 dark:bg-gray-700"
                      >
                        <div
                          className="h-full bg-cyan-600 dark:bg-cyan-500"
                          style={{ width: `${progress}%` }}
                        />
                      </Progress>
                      <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                        {progress}%
                      </p>
                    </div>
                  )}

                  {/* Create button */}
                  <Button
                    type="submit"
                    className="w-full mt-4 bg-[rgb(64,126,139)] hover:bg-[rgb(54,116,129)] dark:bg-[rgb(74,136,149)] dark:hover:bg-[rgb(84,146,159)] text-white"
                    disabled={isSubmitting || courseVideos.length === 0}
                  >
                    {isSubmitting ? "Creating Course..." : "Create Course"}
                  </Button>

                  {/* Validation notice */}
                  {courseVideos.length === 0 && (
                    <p className="text-xs text-center text-amber-600 dark:text-amber-500 mt-2">
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
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
              Course Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-900">
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
              className="w-full sm:w-auto bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Explore Courses
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
