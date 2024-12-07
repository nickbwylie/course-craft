import { SERVER } from "@/constants";
import axios from "axios";

export interface AddCourseRequest {
  title: string;
  description: string;
  video_ids: string[];
  user_id: string;
}

export type YoutubeVideoPreview = {
  channel: string;
  title: string;
  videoId: string;
  duration: string;
  thumbnail: string;
};

export async function createCourse(courseRequest: AddCourseRequest) {
  console.log(courseRequest);

  const data = await axios.post(`${SERVER}/create_course/`, {
    ...courseRequest,
  });

  return data.data;
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

    console.log(data);

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
