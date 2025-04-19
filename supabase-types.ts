export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string
          event_name: string
          id: number
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name?: string
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: number
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      course_videos: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          order: number | null
          video_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          order?: number | null
          video_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          order?: number | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      courses: {
        Row: {
          admin: boolean
          author_id: string | null
          course_difficulty: number
          created_at: string
          description: string | null
          detailLevel: string
          id: string
          public: boolean | null
          title: string | null
          view_count: number
        }
        Insert: {
          admin?: boolean
          author_id?: string | null
          course_difficulty?: number
          created_at?: string
          description?: string | null
          detailLevel?: string
          id?: string
          public?: boolean | null
          title?: string | null
          view_count?: number
        }
        Update: {
          admin?: boolean
          author_id?: string | null
          course_difficulty?: number
          created_at?: string
          description?: string | null
          detailLevel?: string
          id?: string
          public?: boolean | null
          title?: string | null
          view_count?: number
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          quiz: Json | null
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          quiz?: Json | null
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          quiz?: Json | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      summaries: {
        Row: {
          created_at: string
          id: string
          summary_text: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          summary_text?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          summary_text?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "summaries_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          credits: number
          email: string | null
          id: string
          paid: boolean
        }
        Insert: {
          created_at?: string
          credits?: number
          email?: string | null
          id?: string
          paid?: boolean
        }
        Update: {
          created_at?: string
          credits?: number
          email?: string | null
          id?: string
          paid?: boolean
        }
        Relationships: []
      }
      videos: {
        Row: {
          channel_thumbnail: string | null
          channel_title: string | null
          created_at: string
          description: string | null
          duration: string | null
          published_at: string | null
          tags: Json | null
          thumbnail_url: string | null
          title: string | null
          video_id: string
          view_count: string | null
          youtube_id: string
        }
        Insert: {
          channel_thumbnail?: string | null
          channel_title?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          published_at?: string | null
          tags?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          video_id: string
          view_count?: string | null
          youtube_id?: string
        }
        Update: {
          channel_thumbnail?: string | null
          channel_title?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          published_at?: string | null
          tags?: Json | null
          thumbnail_url?: string | null
          title?: string | null
          video_id?: string
          view_count?: string | null
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      filtered_course_details: {
        Args: { course_id: string }
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          video_duration: string
          video_summary: string
          quiz_id: string
          quiz: Json
          youtube_id: string
          course_difficulty: number
          detaillevel: string
          channel_thumbnail: string
          channel_title: string
          view_count: string
          published_at: string
          order_by: number
        }[]
      }
      get_admin_courses_with_first_video_and_duration: {
        Args: Record<PropertyKey, never>
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          thumbnail_url: string
          total_duration: string
          total_videos: number
          created_at: string
          course_difficulty: number
          detaillevel: string
          public: boolean
          view_count: number
        }[]
      }
      get_course_data: {
        Args: { course_id: string }
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          video_summary: string
          quiz_id: number
          question_text: string
          correct_answer: string
        }[]
      }
      get_course_details: {
        Args: { course_id: string }
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          video_duration: string
          video_summary: string
          quiz_id: string
          quiz: Json
          youtube_id: string
          course_difficulty: number
          detaillevel: string
          channel_thumbnail: string
          channel_title: string
          view_count: string
          published_at: string
          order_by: number
        }[]
      }
      get_course_info: {
        Args: { course_id: string }
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          video_summary: string
          quiz_id: number
          question_text: string
          correct_answer: string
        }[]
      }
      get_courses_with_first_video: {
        Args: Record<PropertyKey, never>
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          thumbnail_url: string
        }[]
      }
      get_courses_with_first_video_and_duration: {
        Args: Record<PropertyKey, never>
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          thumbnail_url: string
          total_duration: string
          total_videos: number
          created_at: string
          course_difficulty: number
          detaillevel: string
          public: boolean
        }[]
      }
      get_user_courses_with_first_video_and_duration: {
        Args: { user_id: string }
        Returns: {
          course_id: string
          course_title: string
          course_description: string
          video_id: string
          video_title: string
          thumbnail_url: string
          total_duration: string
          total_videos: number
          created_at: string
          course_difficulty: number
          detaillevel: string
          public: boolean
          view_count: number
        }[]
      }
      increment_view_count: {
        Args: { course_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
