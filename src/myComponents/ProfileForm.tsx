import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import YoutubeDataTable from "./YoutubeDataTable";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";
import {
  AddCourseRequest,
  calculateTotalDuration,
  createCourse,
  getYouTubeVideoData,
  YoutubeVideoPreview,
} from "@/helperFunctions/youtubeVideo";
import { randomUUID } from "crypto";

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

export function ProfileForm() {
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

  const totalCourseTime = useMemo(() => {
    const durationArray: string[] = [];

    courseVideos.map((video) => {
      durationArray.push(video.duration);
    });

    const durationTotal = calculateTotalDuration(durationArray);

    return durationTotal;
  }, [courseVideos]);

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-left mt-8"
      >
        <h3 className="font-semibold">Course Information</h3>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input id="title" placeholder="Course Title" {...field} />
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
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Describe what your course is going to cover"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <h3 className="font-semibold">Add YouTube Videos</h3>
        <YoutubeDataTable
          courseVideos={courseVideos}
          youtubeVideoUrl={youtubeVideoUrl}
          setYoutubeVideoUrl={setYoutubeVideoUrl}
          addYoutubeVideo={addYoutubeUrl}
        />

        {totalCourseTime && <h6>Course Time {totalCourseTime}</h6>}
        <Separator className="my-4" />

        <fieldset className="border p-4 mb-4">
          <legend className="font-semibold">Customization</legend>
          <div className="w-full flex flex-nowrap gap-4">
            <FormField
              control={form.control}
              name="summaryDetail"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel htmlFor="summaryDetail">Summary Detail</FormLabel>
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
                  <FormDescription>
                    Simple provides quick short summaries. High detail provides
                    longer more detailed summaries for each lecture.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseDifficulty"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel htmlFor="courseDifficulty">
                    Course Difficulty
                  </FormLabel>
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
                      <SelectItem value="Difficult">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Increasing the difficulty will increase the number of quiz
                    questions and the difficulty of the questions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        <Button type="submit">Submit</Button>
      </form>

      {courseAdded && (
        <h3 className="mb-10 font-semibold">Course has been added</h3>
      )}
    </Form>
  );
}
