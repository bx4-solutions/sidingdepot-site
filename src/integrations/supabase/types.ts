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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ab_events: {
        Row: {
          city: string | null
          event_type: string
          id: string
          landing_page: string | null
          metadata: Json | null
          service_key: string
          timestamp: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          variation: string
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          event_type: string
          id?: string
          landing_page?: string | null
          metadata?: Json | null
          service_key: string
          timestamp?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variation: string
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          event_type?: string
          id?: string
          landing_page?: string | null
          metadata?: Json | null
          service_key?: string
          timestamp?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variation?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      alert_history: {
        Row: {
          created_at: string | null
          id: string
          metric_value: number
          rule_id: string | null
          status: string | null
          threshold_value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_value: number
          rule_id?: string | null
          status?: string | null
          threshold_value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_value?: number
          rule_id?: string | null
          status?: string | null
          threshold_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "alert_history_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "alert_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_rules: {
        Row: {
          comparison_operator: string
          created_at: string | null
          id: string
          is_active: boolean | null
          metric: string
          name: string
          threshold: number
          time_window_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          comparison_operator: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metric: string
          name: string
          threshold: number
          time_window_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          comparison_operator?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          metric?: string
          name?: string
          threshold?: number
          time_window_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          keywords: string[] | null
          published_at: string | null
          slug: string
          status: string | null
          suggested_date: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          slug: string
          status?: string | null
          suggested_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          slug?: string
          status?: string | null
          suggested_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      campaign_metrics_daily: {
        Row: {
          campaign_id: string | null
          conversions: number | null
          created_at: string | null
          date: string
          id: string
          reach: number | null
          revenue: number | null
          views: number | null
          visitors: number | null
        }
        Insert: {
          campaign_id?: string | null
          conversions?: number | null
          created_at?: string | null
          date: string
          id?: string
          reach?: number | null
          revenue?: number | null
          views?: number | null
          visitors?: number | null
        }
        Update: {
          campaign_id?: string | null
          conversions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          reach?: number | null
          revenue?: number | null
          views?: number | null
          visitors?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_daily_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          current_revenue: number | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          target_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_revenue?: number | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          target_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_revenue?: number | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          target_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          avg_position: number | null
          city: string | null
          clicks: number | null
          created_at: string | null
          ctr: number | null
          date: string
          id: string
          impressions: number | null
          leads: number | null
          service_key: string | null
          source: string
          variation: string | null
          views: number | null
        }
        Insert: {
          avg_position?: number | null
          city?: string | null
          clicks?: number | null
          created_at?: string | null
          ctr?: number | null
          date: string
          id?: string
          impressions?: number | null
          leads?: number | null
          service_key?: string | null
          source: string
          variation?: string | null
          views?: number | null
        }
        Update: {
          avg_position?: number | null
          city?: string | null
          clicks?: number | null
          created_at?: string | null
          ctr?: number | null
          date?: string
          id?: string
          impressions?: number | null
          leads?: number | null
          service_key?: string | null
          source?: string
          variation?: string | null
          views?: number | null
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          author_name: string
          author_photo_url: string | null
          created_at: string
          google_review_id: string
          id: string
          rating: number
          relative_time_description: string | null
          text: string | null
          time_timestamp: number
          updated_at: string
        }
        Insert: {
          author_name: string
          author_photo_url?: string | null
          created_at?: string
          google_review_id: string
          id?: string
          rating: number
          relative_time_description?: string | null
          text?: string | null
          time_timestamp: number
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_photo_url?: string | null
          created_at?: string
          google_review_id?: string
          id?: string
          rating?: number
          relative_time_description?: string | null
          text?: string | null
          time_timestamp?: number
          updated_at?: string
        }
        Relationships: []
      }
      google_reviews_sync_log: {
        Row: {
          created_at: string | null
          id: string
          place_id: string
          reviews_count: number | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          place_id: string
          reviews_count?: number | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          place_id?: string
          reviews_count?: number | null
          status?: string
        }
        Relationships: []
      }
      gsc_settings: {
        Row: {
          created_at: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          property_id: string | null
          site_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          property_id?: string | null
          site_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          property_id?: string | null
          site_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      sync_jobs: {
        Row: {
          details: Json | null
          id: string
          job_name: string
          last_run: string | null
          status: string
        }
        Insert: {
          details?: Json | null
          id?: string
          job_name: string
          last_run?: string | null
          status: string
        }
        Update: {
          details?: Json | null
          id?: string
          job_name?: string
          last_run?: string | null
          status?: string
        }
        Relationships: []
      }
      traffic_metrics_daily: {
        Row: {
          appointments: number | null
          avg_session_duration: string | null
          bounce_rate: number | null
          conversions: number | null
          created_at: string | null
          date: string
          id: string
          page_views: number | null
          total_visitors: number | null
          unique_visitors: number | null
        }
        Insert: {
          appointments?: number | null
          avg_session_duration?: string | null
          bounce_rate?: number | null
          conversions?: number | null
          created_at?: string | null
          date: string
          id?: string
          page_views?: number | null
          total_visitors?: number | null
          unique_visitors?: number | null
        }
        Update: {
          appointments?: number | null
          avg_session_duration?: string | null
          bounce_rate?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          page_views?: number | null
          total_visitors?: number | null
          unique_visitors?: number | null
        }
        Relationships: []
      }
      traffic_sources_daily: {
        Row: {
          conversions: number | null
          created_at: string | null
          date: string
          id: string
          revenue: number | null
          source: string
          visitors: number | null
        }
        Insert: {
          conversions?: number | null
          created_at?: string | null
          date: string
          id?: string
          revenue?: number | null
          source: string
          visitors?: number | null
        }
        Update: {
          conversions?: number | null
          created_at?: string | null
          date?: string
          id?: string
          revenue?: number | null
          source?: string
          visitors?: number | null
        }
        Relationships: []
      }
      utm_campaigns: {
        Row: {
          conv_rate: number | null
          conversions: number | null
          id: string
          last_synced: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitors: number | null
        }
        Insert: {
          conv_rate?: number | null
          conversions?: number | null
          id?: string
          last_synced?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitors?: number | null
        }
        Update: {
          conv_rate?: number | null
          conversions?: number | null
          id?: string
          last_synced?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitors?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      log_admin_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_entity_id?: string
          p_entity_type?: string
          p_status?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "viewer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      user_role: ["admin", "viewer"],
    },
  },
} as const
