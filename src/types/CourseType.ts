export interface YoutubeVideoData {
  channel_title: string;
  created_at: string;

  description: string;

  duration: string;

  published_at: string;

  tags: string[];

  thumbnail_url: string;

  title: string;

  video_id: string;
}

export interface CourseWithFirstVideo {
  course_description: string;
  course_id: string;
  course_title: string;
  thumbnail_url: string;
  video_id: string;
  video_title: string;
  total_duration: string;
  total_videos: number;
  created_at: string;
}
