import { Input } from "@/components/ui/input";
import YoutubeDataTable from "@/myComponents/YoutubeDataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  AddCourseRequest,
  createCourse,
  getYouTubeVideoData,
  YoutubeVideoPreview,
} from "@/helperFunctions/youtubeVideo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "../hooks/use-toast.ts";
import { Progress } from "../components/ui/progress.tsx";
import {
  Toast,
  ToastDescription,
  ToastTitle,
} from "../components/ui/toast.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

const profileFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  courseDifficulty: z
    .string({
      required_error: "Please enter the course difficulty.",
    })
    .min(2),
  courseDetail: z.string().max(50).min(2),
  description: z.string().max(160).min(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

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
      <ToastTitle>Creating course...</ToastTitle>
      <ToastDescription>
        <div className="mt-2 w-24 h-full flex justify-start">
          <Progress value={progress} className="w-full h-2" />
        </div>
      </ToastDescription>
    </Toast>
  );
}

export default function CreateCourse() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  // user
  const { user } = useAuth();

  // logic to add youtube videos to the data table

  const [courseAdded, setCourseAdded] = useState(false);

  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");

  const [courseVideos, setCourseVideos] = useState<YoutubeVideoPreview[]>([]);

  function extractYouTubeVideoId(url: string): string | null {
    try {
      // Use URL constructor to safely parse the URL
      const parsedUrl = new URL(url);

      // Check if it's a YouTube domain
      if (
        parsedUrl.hostname === "www.youtube.com" ||
        parsedUrl.hostname === "youtube.com"
      ) {
        const videoId = parsedUrl.searchParams.get("v");
        return videoId ? videoId : null;
      }

      // Also support shortened YouTube URLs like youtu.be
      if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.substring(1);
        return videoId ? videoId : null;
      }

      // If it's not a valid YouTube URL, return null
      return null;
    } catch (error) {
      console.error(error);
      // If the input is not a valid URL, catch the error and return null
      return null;
    }
  }

  async function addYoutubeUrl() {
    // first need to stript the url to find just the video id
    const videoId = extractYouTubeVideoId(youtubeVideoUrl);

    if (!videoId) return;

    if (courseVideos?.find((vid) => vid.videoId === videoId)) return;

    const newVideo = await getYouTubeVideoData(videoId);

    if (!newVideo) return;

    // add video to the array
    if (courseVideos && courseVideos?.length > 0) {
      setCourseVideos([...courseVideos, newVideo]);
    } else {
      setCourseVideos([newVideo]);
    }
    setYoutubeVideoUrl("");
  }

  // const totalCourseTime = useMemo(() => {
  //   const durationArray: string[] = [];

  //   courseVideos.map((video) => {
  //     durationArray.push(video.duration);
  //   });

  //   const durationTotal = calculateTotalDuration(durationArray);

  //   return durationTotal;
  // }, [courseVideos]);

  const { toast, dismiss } = useToast();
  const [toastId, setToastId] = useState<string | undefined>(undefined);

  function showOrUpdateToast(progress: number, oldToastId?: string) {
    // If there's an older toast, dismiss it
    if (oldToastId) {
      dismiss(oldToastId);
    }

    // Create a new toast and return its ID
    return toast({
      title: "Creating course...",
      description: <Progress value={progress} className="w-full h-2" />,
      // Keep the toast on-screen until manually dismissed
      duration: Infinity,
    });
  }

  const waitASec = new Promise((resolveInner) => {
    setTimeout(resolveInner, 10000);
  });

  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  async function onSubmit(data: ProfileFormValues) {
    console.log("calling on submit");
    if (courseVideos.length == 0) {
      console.error("no youtube videos");
      return;
    }

    if (!user?.id) {
      console.error("the user is undefined");
      return;
    }

    // check all fields

    // add course
    //
    const videoIds: string[] = [];

    courseVideos.map((course) => {
      videoIds.push(course.videoId);
    });

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
      youtube_ids: videoIds,
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

    console.log(courseRequest);

    setOpen(true);
    setProgress(0);

    // Start the progress timer
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += 5;
      if (currentProgress <= 90) {
        setProgress(currentProgress);
      } else {
        clearInterval(timer);
      }
    }, 200); // 1000ms interval

    try {
      // Make your real API call here
      const res = await createCourse(courseRequest);
      console.log(res);

      // Once API is done, clear the timer and set progress to 100
      clearInterval(timer);
      setProgress(100);

      setOpen(false);
      // Optionally, show an ephemeral success toast
      toast({
        title: `Course Created`,
        description: `Course: ${data.title} has been successfully created.`,
      });
      setCourseAdded(true);
    } catch (error) {
      clearInterval(timer);
      console.error(error);
      setOpen(false);
      // Optionally, show an error toast
      toast({
        title: `Error`,
        description: `Failed to create course.`,
      });
    }
  }

  const handleCreateCourse = () => {
    console.log("opening toast?");
    // Start the toast at 0%
    setProgress(0);
    setOpen(true);

    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += 10;
      console.log("current progress", currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        // Mark final progress, then close toast in a moment
        setProgress(100);
        setTimeout(() => {
          setOpen(false);
        }, 1000); // give users a moment to see 100% before closing
      } else {
        setProgress(currentProgress);
      }
    }, 1000);
  };

  return (
    <div className="flex h-screen flex-row">
      <CourseProgressToast
        open={open}
        progress={progress}
        onOpenChange={setOpen}
      />
      <div className=" flex-grow flex flex-col py-10 pt-8 px-8 justify-start space-y-6 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 text-left mt-0"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                borderBottomWidth: 2,
              }}
            >
              <div
                style={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="pr-2"
              >
                <h3 className="text-xl text-left font-semibold pb-2">
                  Course Information
                </h3>
                <div className="text-sm text-left text-slate-500">
                  Use this to create an awesome name description for your course
                </div>
              </div>

              <div style={{ width: "70%" }} className="space-y-4 pr-4 mb-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="title"
                          placeholder="Course Title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="description"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                borderBottomWidth: 2,
              }}
            >
              <div
                style={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="pr-2"
              >
                <h3 className="text-xl text-left font-semibold pb-2">
                  Add YouTube Videos
                </h3>
                <div className="text-sm text-left text-slate-500">
                  1. Find the YouTube video to add. <br /> 2. Copy and paste the
                  url.
                  <br />
                  3. Click add to add the video to the course.
                </div>
              </div>
              <div style={{ width: "70%" }} className="space-y-4 pr-4 mb-8">
                <YoutubeDataTable
                  addYoutubeVideo={addYoutubeUrl}
                  courseVideos={courseVideos}
                  setYoutubeVideoUrl={setYoutubeVideoUrl}
                  youtubeVideoUrl={youtubeVideoUrl}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="pr-2 mb-8"
              >
                <h3 className="text-xl text-left font-semibold pb-2">
                  Customization
                </h3>
                <div className="text-sm text-left text-slate-500">
                  Provide the course a provide a course difficulty from simple
                  to advanced. And a level of detail ( increasing the length of
                  the summaries)
                </div>
              </div>
              <div style={{ width: "70%" }} className="space-y-4 pr-4 mb-8">
                <FormField
                  control={form.control}
                  name="courseDetail"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level of course detail" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Simple">Simple</SelectItem>
                          <SelectItem value="Normal">
                            Normal (Recommended)
                          </SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseDifficulty"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level of course difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Simple">Easy</SelectItem>
                          <SelectItem value="Normal">
                            Normal (Recommended)
                          </SelectItem>
                          <SelectItem value="High">Difficult</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              className="w-48 p-4 justify-self-start bg-cyan-600 hover:bg-cyan-500"
              type="submit"
            >
              Add Course
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
