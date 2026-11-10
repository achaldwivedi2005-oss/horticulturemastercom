export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_allowlist: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: Json
          role: string
          thread_id: string
          ui_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: Json
          role: string
          thread_id: string
          ui_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: Json
          role?: string
          thread_id?: string
          ui_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      exam_updates: {
        Row: {
          created_at: string
          exam: string
          id: string
          is_pinned: boolean
          key_dates: Json
          kind: string
          last_date: string | null
          official_url: string | null
          published_date: string | null
          source_name: string | null
          status: string
          summary: string | null
          summary_hi: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam?: string
          id?: string
          is_pinned?: boolean
          key_dates?: Json
          kind?: string
          last_date?: string | null
          official_url?: string | null
          published_date?: string | null
          source_name?: string | null
          status?: string
          summary?: string | null
          summary_hi?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam?: string
          id?: string
          is_pinned?: boolean
          key_dates?: Json
          kind?: string
          last_date?: string | null
          official_url?: string | null
          published_date?: string | null
          source_name?: string | null
          status?: string
          summary?: string | null
          summary_hi?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_monitor_runs: {
        Row: {
          errors: Json
          finished_at: string | null
          id: string
          new_postings: number
          sources_checked: number
          started_at: string
          trigger: string
        }
        Insert: {
          errors?: Json
          finished_at?: string | null
          id?: string
          new_postings?: number
          sources_checked?: number
          started_at?: string
          trigger?: string
        }
        Update: {
          errors?: Json
          finished_at?: string | null
          id?: string
          new_postings?: number
          sources_checked?: number
          started_at?: string
          trigger?: string
        }
        Relationships: []
      }
      job_monitor_settings: {
        Row: {
          ai_paused_at: string | null
          ai_paused_reason: string | null
          alert_mode: string
          auto_publish: boolean
          closing_soon_days: number
          id: number
          last_run_at: string | null
          scan_interval_hours: number
          telegram_chat_id: string | null
          updated_at: string
        }
        Insert: {
          ai_paused_at?: string | null
          ai_paused_reason?: string | null
          alert_mode?: string
          auto_publish?: boolean
          closing_soon_days?: number
          id?: number
          last_run_at?: string | null
          scan_interval_hours?: number
          telegram_chat_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_paused_at?: string | null
          ai_paused_reason?: string | null
          alert_mode?: string
          auto_publish?: boolean
          closing_soon_days?: number
          id?: number
          last_run_at?: string | null
          scan_interval_hours?: number
          telegram_chat_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          age_limit: string | null
          alerted_at: string | null
          application_fee: string | null
          application_mode: string | null
          apply_url: string | null
          categories: string[]
          created_at: string
          deadline: string | null
          degree_levels: string[]
          department: string | null
          fingerprint: string
          id: string
          institute: string | null
          is_breaking: boolean
          is_pinned: boolean
          is_updated_notification: boolean
          last_verified_at: string | null
          location: string | null
          net_compulsory: boolean | null
          notification_url: string | null
          opening_date: string | null
          phd_compulsory: boolean | null
          previous_deadlines: Json
          published_date: string | null
          qualification: string | null
          salary: string | null
          scope: string | null
          source_id: string | null
          source_url: string | null
          specialization: string | null
          state_name: string | null
          status: string
          summary_en: string | null
          summary_hi: string | null
          title: string
          updated_at: string
          vacancies: string | null
          why_it_matters: string | null
        }
        Insert: {
          age_limit?: string | null
          alerted_at?: string | null
          application_fee?: string | null
          application_mode?: string | null
          apply_url?: string | null
          categories?: string[]
          created_at?: string
          deadline?: string | null
          degree_levels?: string[]
          department?: string | null
          fingerprint: string
          id?: string
          institute?: string | null
          is_breaking?: boolean
          is_pinned?: boolean
          is_updated_notification?: boolean
          last_verified_at?: string | null
          location?: string | null
          net_compulsory?: boolean | null
          notification_url?: string | null
          opening_date?: string | null
          phd_compulsory?: boolean | null
          previous_deadlines?: Json
          published_date?: string | null
          qualification?: string | null
          salary?: string | null
          scope?: string | null
          source_id?: string | null
          source_url?: string | null
          specialization?: string | null
          state_name?: string | null
          status?: string
          summary_en?: string | null
          summary_hi?: string | null
          title: string
          updated_at?: string
          vacancies?: string | null
          why_it_matters?: string | null
        }
        Update: {
          age_limit?: string | null
          alerted_at?: string | null
          application_fee?: string | null
          application_mode?: string | null
          apply_url?: string | null
          categories?: string[]
          created_at?: string
          deadline?: string | null
          degree_levels?: string[]
          department?: string | null
          fingerprint?: string
          id?: string
          institute?: string | null
          is_breaking?: boolean
          is_pinned?: boolean
          is_updated_notification?: boolean
          last_verified_at?: string | null
          location?: string | null
          net_compulsory?: boolean | null
          notification_url?: string | null
          opening_date?: string | null
          phd_compulsory?: boolean | null
          previous_deadlines?: Json
          published_date?: string | null
          qualification?: string | null
          salary?: string | null
          scope?: string | null
          source_id?: string | null
          source_url?: string | null
          specialization?: string | null
          state_name?: string | null
          status?: string
          summary_en?: string | null
          summary_hi?: string | null
          title?: string
          updated_at?: string
          vacancies?: string | null
          why_it_matters?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      job_sources: {
        Row: {
          active: boolean
          content_hash: string | null
          created_at: string
          id: string
          last_checked_at: string | null
          last_error: string | null
          last_status: string | null
          name: string
          organisation_type: string
          url: string
        }
        Insert: {
          active?: boolean
          content_hash?: string | null
          created_at?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          last_status?: string | null
          name: string
          organisation_type?: string
          url: string
        }
        Update: {
          active?: boolean
          content_hash?: string | null
          created_at?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          last_status?: string | null
          name?: string
          organisation_type?: string
          url?: string
        }
        Relationships: []
      }
      note_access: {
        Row: {
          created_at: string
          premium_until: string | null
          trial_started_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          premium_until?: string | null
          trial_started_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          premium_until?: string | null
          trial_started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          goal: string | null
          id: string
          phone: string | null
          preparation_from: string | null
          state: string | null
          target_exam: string | null
          university: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string
          goal?: string | null
          id: string
          phone?: string | null
          preparation_from?: string | null
          state?: string | null
          target_exam?: string | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          goal?: string | null
          id?: string
          phone?: string | null
          preparation_from?: string | null
          state?: string | null
          target_exam?: string | null
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      jobs_auto_publish: { Args: never; Returns: boolean }
      jobs_closing_soon_days: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
