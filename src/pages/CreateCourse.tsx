import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/supabaseconsant";
import { FaYoutube } from "react-icons/fa";
import {
  Briefcase,
  Check,
  ChevronRight,
  Clock,
  HelpCircle,
  ListTodo,
  MonitorPlay,
  Plus,
  Upload,
  X,
  Youtube,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "../components/ui/progress";
import { Toast, ToastDescription, ToastTitle } from "../components/ui/toast";
import { useToast } from "../hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// Define form schema
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
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

// CourseProgressToast Component
function CourseProgressToast({
  open,
  progress,
  onOpenChange,
}: {
  open: boolean;
  progress: number;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Toast
      open={open}
      onOpenChange={onOpenChange}
      className="flex flex-col items-start gap-2"
    >
      <ToastTitle>Creating your course</ToastTitle>
      <ToastDescription className="w-full">
        <div className="mt-2 mb-1 w-full h-full">
          <Progress value={progress} className="w-full h-2" />
        </div>
        <div className="text-xs text-right">{progress}%</div>
      </ToastDescription>
    </Toast>
  );
}

// VideoCard Component
const VideoCard = ({
  video,
  onRemove,
}: {
  video: YoutubeVideoPreview;
  onRemove: (id: string) => void;
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="w-32 h-24 relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs py-0.5 px-1 rounded">
            {parseYouTubeDuration(video.duration)}
          </div>
        </div>
        <div className="flex-1 p-3 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500"
            onClick={() => onRemove(video.videoId)}
          >
            <X className="h-3 w-3" />
          </Button>
          <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{video.channel}</p>
        </div>
      </div>
    </Card>
  );
};

// Helper functions
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

// Main Component
export default function CreateCourse() {
  // Form and state management
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      courseDifficulty: "",
      courseDetail: "",
    },
    mode: "onChange",
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const [videoUrl, setVideoUrl] = useState("");
  const [courseVideos, setCourseVideos] = useState<YoutubeVideoPreview[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState("");

  // Calculate total duration
  const totalDuration = calculateTotalDuration(
    courseVideos.map((video) => video.duration)
  );
  const totalVideos = courseVideos.length;

  // Handle video addition
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

    // Check if video already exists in the list
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

  // Handle video removal
  function handleRemoveVideo(videoId: string) {
    setCourseVideos((prev) =>
      prev.filter((video) => video.videoId !== videoId)
    );
  }

  // Form submission
  async function onSubmit(data: CourseFormValues) {
    if (courseVideos.length === 0) {
      toast({
        title: "No videos added",
        description: "Please add at least one video to your course",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Not signed in",
        description: "Please sign in to create a course",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    // Start the progress timer
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <CourseProgressToast
        open={isSubmitting}
        progress={progress}
        onOpenChange={setIsSubmitting}
      />

      {/* Success dialog */}
      <AlertDialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Course Created Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your course has been created and is now available for others to
              explore. What would you like to do next?
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

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create a New Course</h1>
          <p className="text-gray-500 mt-1">
            Build a custom course by adding YouTube videos and configuring
            settings
          </p>
        </div>

        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`ml-2 ${
                currentStep >= 1 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              <div className="text-sm font-medium">Course Info</div>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-gray-400" />

          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`ml-2 ${
                currentStep >= 2 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              <div className="text-sm font-medium">Add Videos</div>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-gray-400" />

          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
            <div
              className={`ml-2 ${
                currentStep >= 3 ? "text-gray-900" : "text-gray-500"
              }`}
            >
              <div className="text-sm font-medium">Customize</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="step1"
        className="w-full"
        value={`step${currentStep}`}
        onValueChange={(value) => {
          if (value === "step1") setCurrentStep(1);
          else if (value === "step2") setCurrentStep(2);
          else if (value === "step3") setCurrentStep(3);
        }}
      >
        {/* <TabsList className="w-full mb-8">
          <TabsTrigger value="step1">Course Information</TabsTrigger>
          <TabsTrigger value="step2">Add Videos</TabsTrigger>
          <TabsTrigger value="step3">Customize</TabsTrigger>
        </TabsList> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left panel - always visible */}
              <div className="md:col-span-2 space-y-8">
                <TabsContent value="step1" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-cyan-600" />
                        Course Information
                      </CardTitle>
                      <CardDescription>
                        Add a compelling title and description for your course
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Complete Guide to Machine Learning"
                                {...field}
                                className="bg-white"
                              />
                            </FormControl>
                            <FormDescription>
                              A clear, specific title helps learners find your
                              course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what learners will gain from your course"
                                {...field}
                                className="min-h-[100px] bg-white"
                              />
                            </FormControl>
                            <FormDescription>
                              A good description helps learners understand the
                              value and content of your course
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        className="hover:bg-gray-100"
                        disabled
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        style={{ backgroundColor: "rgb(64,126,139)" }}
                        onClick={() => {
                          form.trigger(["title", "description"]);
                          const titleValid =
                            form.getFieldState("title").invalid === false;
                          const descValid =
                            form.getFieldState("description").invalid === false;

                          if (titleValid && descValid) {
                            setCurrentStep(2);
                          }
                        }}
                      >
                        Next: Add Videos
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="step2" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-600" />
                        Add YouTube Videos
                      </CardTitle>
                      <CardDescription>
                        Find and add videos that will make up your course
                        curriculum
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="flex gap-2">
                            <div className="relative flex-grow">
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <FaYoutube className="h-5 w-5 text-red-600" />
                              </div>
                              <Input
                                placeholder="Paste YouTube video URL here"
                                value={videoUrl}
                                onChange={(e) => {
                                  setVideoUrl(e.target.value);
                                  setAddVideoError("");
                                }}
                                className="pl-10 pr-4 py-3 bg-white"
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
                              style={{ backgroundColor: "rgb(64,126,139)" }}
                            >
                              {isAddingVideo ? "Adding..." : "Add Video"}
                            </Button>
                          </div>
                          {addVideoError && (
                            <p className="text-sm text-red-500 mt-1">
                              {addVideoError}
                            </p>
                          )}
                          <FormDescription className="mt-2 text-sm text-gray-500">
                            Add videos by pasting YouTube URLs (e.g.,
                            https://www.youtube.com/watch?v=dQw4w9WgXcQ)
                          </FormDescription>
                        </div>

                        {courseVideos.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium">
                                Course Videos ({courseVideos.length})
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
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
                            </div>
                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto p-1">
                              {courseVideos.map((video, index) => (
                                <VideoCard
                                  key={video.videoId}
                                  video={video}
                                  onRemove={handleRemoveVideo}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                            <MonitorPlay className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              No videos added yet
                            </h3>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                              Add videos by pasting YouTube URLs above. These
                              videos will make up your course content.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="hover:bg-gray-100"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        style={{ backgroundColor: "rgb(64,126,139)" }}
                        disabled={courseVideos.length === 0}
                        onClick={() => {
                          if (courseVideos.length === 0) {
                            toast({
                              title: "No videos added",
                              description:
                                "Please add at least one video before proceeding",
                            });
                            return;
                          }

                          setCurrentStep(3);
                        }}
                      >
                        Next: Customize
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="step3" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-cyan-600" />
                        Customize Course
                      </CardTitle>
                      <CardDescription>
                        Adjust settings to tailor the learning experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="courseDifficulty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Difficulty</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select difficulty level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Simple">Easy</SelectItem>
                                    <SelectItem value="Normal">
                                      Normal (Recommended)
                                    </SelectItem>
                                    <SelectItem value="High">
                                      Advanced
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 cursor-help">
                                        <HelpCircle className="h-3 w-3" />
                                        How does this affect my course?
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">
                                        Difficulty setting affects the
                                        complexity of quiz questions generated
                                        for your course. Higher difficulty means
                                        more challenging questions.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="courseDetail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Summary Detail Level</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select level of detail" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Simple">
                                      Brief
                                    </SelectItem>
                                    <SelectItem value="Normal">
                                      Standard (Recommended)
                                    </SelectItem>
                                    <SelectItem value="High">
                                      Comprehensive
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 cursor-help">
                                        <HelpCircle className="h-3 w-3" />
                                        How does this affect my course?
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">
                                        Detail level controls the length and
                                        depth of AI-generated summaries. Higher
                                        detail provides more comprehensive
                                        summaries for each video.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="advanced">
                          <AccordionTrigger className="text-sm">
                            Advanced Settings
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2 pb-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium">
                                    Quiz Questions per Video
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Number of quiz questions generated for each
                                    video
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="h-7 px-2"
                                  >
                                    -
                                  </Button>
                                  <span className="text-sm font-medium w-6 text-center">
                                    {form.watch("courseDifficulty") === "Simple"
                                      ? "1"
                                      : form.watch("courseDifficulty") ===
                                        "Normal"
                                      ? "2"
                                      : "3"}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="h-7 px-2"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="hover:bg-gray-100"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ backgroundColor: "rgb(64,126,139)" }}
                      >
                        {isSubmitting ? "Creating Course..." : "Create Course"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </div>

              {/* Right sidebar - course summary */}
              <div className="md:col-span-1">
                <div className="sticky top-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Course Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Course Title
                        </h3>
                        <p className="text-sm mt-1">
                          {form.watch("title") || "Not specified yet"}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Videos
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MonitorPlay className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {totalVideos}{" "}
                            {totalVideos === 1 ? "video" : "videos"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Duration
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {totalDuration === "00:00:00"
                              ? "No videos added"
                              : totalDuration}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Settings
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.watch("courseDifficulty") && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 hover:bg-gray-100 cursor-default"
                            >
                              {form.watch("courseDifficulty")} Difficulty
                            </Badge>
                          )}
                          {form.watch("courseDetail") && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 hover:bg-gray-100 cursor-default"
                            >
                              {form.watch("courseDetail")} Detail
                            </Badge>
                          )}
                          {!form.watch("courseDifficulty") &&
                            !form.watch("courseDetail") && (
                              <span className="text-sm text-gray-500">
                                No settings configured
                              </span>
                            )}
                        </div>
                      </div>

                      <Separator />

                      {courseVideos.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Video Preview
                          </h3>
                          <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                            {courseVideos.slice(0, 3).map((video, index) => (
                              <div
                                key={video.videoId}
                                className="flex items-center gap-2"
                              >
                                <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                  <img
                                    src={video.thumbnail}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <p className="text-xs line-clamp-1">
                                  {video.title}
                                </p>
                              </div>
                            ))}
                            {courseVideos.length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                +{courseVideos.length - 3} more videos
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </Tabs>

      {/* No longer needed */}
    </div>
  );
}
