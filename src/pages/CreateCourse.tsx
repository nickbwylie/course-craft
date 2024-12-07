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
import { toast } from "@/hooks/use-toast";
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
  summaryDetail: z.string().max(50).min(2),
  description: z.string().max(160).min(10),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateCourse() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

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

  async function onSubmit(data: ProfileFormValues) {
    if (courseVideos.length == 0) {
      console.error("no youtube videos");
      return;
    }

    // add course
    //
    const videoIds: string[] = [];

    courseVideos.map((course) => {
      videoIds.push(course.videoId);
    });

    const courseRequest: AddCourseRequest = {
      title: data.title,
      description: data.description,
      user_id: "0919fa60-bc77-41d4-a7b8-72d4df1c4bf0",
      video_ids: videoIds,
    };

    const response = await createCourse(courseRequest);

    console.log(response);

    setCourseAdded(true);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data)}</code>
        </pre>
      ),
    });
  }
  return (
    <div className="flex h-screen flex-row">
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
                  name="summaryDetail"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level of summary detail" />
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
