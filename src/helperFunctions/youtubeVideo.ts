import { SERVER } from "@/constants";
import { supabase } from "@/supabaseconsant";
import axios from "axios";

export interface AddCourseRequest {
  title: string;
  description: string;
  youtube_ids: string[];
  user_id: string;
  difficulty: 1 | 3 | 5;
  questionCount: 1 | 2 | 3;
  summary_detail: 1 | 3 | 5;
  is_public: boolean;
}

export type YoutubeVideoPreview = {
  channel: string;
  title: string;
  videoId: string;
  duration: string;
  thumbnail: string;
};

// success return type
// {
//   message: `Course '${title}' created successfully!`,
//   course_id,
// };

// error return type
//
//  context.response.body = {
//   error: "Some YouTube videos failed to fetch",
//   failed_ids: failedIds.map((r) => r),
// }
//
export interface FailedToAddVideosToCourse {
  message: string;
  failedToAdd: string[];
  course_id: string;
}

export interface CourseCreationResponse {
  message: string;
  course_id: string;
}

export interface FailedToGetTranscripts {
  error: string;
  failed_ids: string[];
}

export async function createCourse(
  courseRequest: AddCourseRequest
): Promise<
  FailedToAddVideosToCourse | CourseCreationResponse | FailedToGetTranscripts
> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  let token = session?.access_token || " ";

  const decoded = JSON.parse(atob(token.split(".")[1])); // Decode payload (base64)
  const isExpired = decoded.exp < Math.floor(Date.now() / 1000);

  if (isExpired) {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      throw new Error("Login expired, please login again");
    }
    token = data.session?.access_token || "";
  }

  try {
    const res = await fetch(`${SERVER}/create_course_embed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT
      },
      body: JSON.stringify(courseRequest),
    });

    const data = await res.json();

    if (data.error) {
      return data as FailedToGetTranscripts;
    }

    if (!res.ok) {
      throw new Error(data.message || "Failed to create course");
    }

    if (data?.failedToAdd) {
      return data as FailedToAddVideosToCourse;
    }

    return data as CourseCreationResponse;
  } catch (e: any) {
    console.error("throwing error inside catch Error:", e);
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("Failed to create course");
  }
}
function parseDuration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return 0; // Return 0 if the duration format is invalid
  }

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  // Return the total time in seconds
  return hours * 3600 + minutes * 60 + seconds;
}

// Function to calculate total time from a list of YouTube video durations
export function calculateTotalDuration(durations: string[]): string {
  // Calculate the total time in seconds
  const totalSeconds = durations.reduce(
    (acc, duration) => acc + parseDuration(duration),
    0
  );

  // Convert total seconds to hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format the result as hh:mm:ss
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function parseYouTubeDuration(duration: string): string {
  // Regular expression to match hours, minutes, and seconds in ISO 8601 duration format
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return "Invalid duration format";
  }

  // Extract hours, minutes, and seconds from the matches
  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  // Format each part to always be two digits (padding with 0 if needed)
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  // If hours are 0, you can omit them for a shorter format (e.g., mm:ss)
  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

export async function getYouTubeVideoData(
  videoId: string
): Promise<YoutubeVideoPreview | null> {
  try {
    const data = await axios.get(`${SERVER}/video_data/${videoId}`);

    const videoData = data.data.items[0];

    // channel title
    const channel = videoData["snippet"]["channelTitle"];
    // video name
    const title = videoData["snippet"]["title"];
    // duration
    const duration = videoData["contentDetails"]["duration"];

    // thumbnail highest quality available
    let thumbnail = "";

    if (videoData["snippet"]["thumbnails"]?.maxres?.url) {
      thumbnail = videoData["snippet"]["thumbnails"]?.maxres?.url;
    } else if (videoData["snippet"]["thumbnails"]?.standard?.url) {
      thumbnail = videoData["snippet"]["thumbnails"]?.standard?.url;
    } else if (videoData["snippet"]["thumbnails"]?.medium?.url) {
      thumbnail = videoData["snippet"]["thumbnails"]?.medium?.url;
    } else {
      thumbnail = videoData["snippet"]["thumbnails"]?.default?.url;
    }
    return {
      channel,
      title,
      duration,
      thumbnail,
      videoId,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getCourseTitleDescriptionFromYoutubeVideos(
  videoInfo: { channel: string; title: string }[]
): Promise<{
  title: string;
  description: string;
} | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  const token = session?.access_token || " ";

  try {
    const res = await fetch(`${SERVER}/generate_title_description`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT
      },
      body: JSON.stringify({ videoInfo: videoInfo }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  } catch (e: any) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("Failed to create course");
  }
}
