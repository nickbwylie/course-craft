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
  course_difficulty: number;
  detaillevel: string;
  public: boolean;
}

export const courseDifficultyMap = {
  0: "Easy",
  1: "Easy",
  2: "Intermediate",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
} as const;
