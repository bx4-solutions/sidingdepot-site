export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      ab_events: {
        Row: {
          city: string | null;
          event_type: string;
          id: string;
          landing_page: string | null;
          metadata: Json | null;
          service_key: string;
          timestamp: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          variation: string;
        };
        Insert: {
          city?: string | null;
          event_type: string;
          id?: string;
          landing_page?: string | null;
          metadata?: Json | null;
          service_key: string;
          timestamp?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          variation: string;
        };
        Update: {
          city?: string | null;
          event_type?: string;
          id?: string;
          landing_page?: string | null;
          metadata?: Json | null;
          service_key?: string;
          timestamp?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          variation?: string;
        };
        Relationships: [];
      };
      alert_rules: {
        Row: {
          condition: Json;
          created_at: string | null;
          enabled: boolean | null;
          id: string;
          name: string;
          type: string;
        };
        Insert: {
          condition: Json;
          created_at?: string | null;
          enabled?: boolean | null;
          id?: string;
          name: string;
          type: string;
        };
        Update: {
          condition?: Json;
          created_at?: string | null;
          enabled?: boolean | null;
          id?: string;
          name?: string;
          type?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          browser: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          device_type: string | null;
          event_type: string;
          fbclid: string | null;
          gclid: string | null;
          id: string;
          lat: number | null;
          lon: number | null;
          os: string | null;
          page_path: string;
          page_title: string | null;
          referrer: string | null;
          region: string | null;
          screen_height: number | null;
          screen_width: number | null;
          scroll_depth: number | null;
          session_id: string;
          source_platform: string | null;
          time_on_page: number | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          browser?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          device_type?: string | null;
          event_type: string;
          fbclid?: string | null;
          gclid?: string | null;
          id?: string;
          lat?: number | null;
          lon?: number | null;
          os?: string | null;
          page_path: string;
          page_title?: string | null;
          referrer?: string | null;
          region?: string | null;
          screen_height?: number | null;
          screen_width?: number | null;
          scroll_depth?: number | null;
          session_id: string;
          source_platform?: string | null;
          time_on_page?: number | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          browser?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          device_type?: string | null;
          event_type?: string;
          fbclid?: string | null;
          gclid?: string | null;
          id?: string;
          lat?: number | null;
          lon?: number | null;
          os?: string | null;
          page_path?: string;
          page_title?: string | null;
          referrer?: string | null;
          region?: string | null;
          screen_height?: number | null;
          screen_width?: number | null;
          scroll_depth?: number | null;
          session_id?: string;
          source_platform?: string | null;
          time_on_page?: number | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          ip_address: string | null;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          ip_address?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          ip_address?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author: string | null;
          author_id: string | null;
          category: string | null;
          content: string | null;
          cover_image: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          keywords: string[] | null;
          meta_description: string | null;
          meta_title: string | null;
          published_at: string | null;
          read_time: number | null;
          schema_json: string | null;
          slug: string;
          status: string | null;
          suggested_date: string | null;
          title: string;
          updated_at: string;
          views: number | null;
        };
        Insert: {
          author?: string | null;
          author_id?: string | null;
          category?: string | null;
          content?: string | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          keywords?: string[] | null;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          read_time?: number | null;
          schema_json?: string | null;
          slug: string;
          status?: string | null;
          suggested_date?: string | null;
          title: string;
          updated_at?: string;
          views?: number | null;
        };
        Update: {
          author?: string | null;
          author_id?: string | null;
          category?: string | null;
          content?: string | null;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          keywords?: string[] | null;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          read_time?: number | null;
          schema_json?: string | null;
          slug?: string;
          status?: string | null;
          suggested_date?: string | null;
          title?: string;
          updated_at?: string;
          views?: number | null;
        };
        Relationships: [];
      };
      daily_metrics: {
        Row: {
          avg_position: number | null;
          city: string | null;
          clicks: number | null;
          created_at: string | null;
          ctr: number | null;
          date: string;
          id: string;
          impressions: number | null;
          leads: number | null;
          service_key: string | null;
          source: string;
          variation: string | null;
          views: number | null;
        };
        Insert: {
          avg_position?: number | null;
          city?: string | null;
          clicks?: number | null;
          created_at?: string | null;
          ctr?: number | null;
          date: string;
          id?: string;
          impressions?: number | null;
          leads?: number | null;
          service_key?: string | null;
          source: string;
          variation?: string | null;
          views?: number | null;
        };
        Update: {
          avg_position?: number | null;
          city?: string | null;
          clicks?: number | null;
          created_at?: string | null;
          ctr?: number | null;
          date?: string;
          id?: string;
          impressions?: number | null;
          leads?: number | null;
          service_key?: string | null;
          source?: string;
          variation?: string | null;
          views?: number | null;
        };
        Relationships: [];
      };
      dashboard_settings: {
        Row: {
          key: string;
          updated_at: string | null;
          value: string | null;
        };
        Insert: {
          key: string;
          updated_at?: string | null;
          value?: string | null;
        };
        Update: {
          key?: string;
          updated_at?: string | null;
          value?: string | null;
        };
        Relationships: [];
      };
      google_place_stats: {
        Row: {
          fetched_at: string;
          id: number;
          rating: number;
          total_reviews: number;
        };
        Insert: {
          fetched_at?: string;
          id?: number;
          rating?: number;
          total_reviews?: number;
        };
        Update: {
          fetched_at?: string;
          id?: number;
          rating?: number;
          total_reviews?: number;
        };
        Relationships: [];
      };
      gsc_settings: {
        Row: {
          created_at: string | null;
          id: string;
          is_connected: boolean | null;
          last_sync_at: string | null;
          property_id: string | null;
          site_url: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_connected?: boolean | null;
          last_sync_at?: string | null;
          property_id?: string | null;
          site_url: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_connected?: boolean | null;
          last_sync_at?: string | null;
          property_id?: string | null;
          site_url?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          city: string | null;
          company: string | null;
          consent: boolean | null;
          created_at: string | null;
          details: string | null;
          email: string | null;
          fbclid: string | null;
          gclid: string | null;
          id: string;
          message: string | null;
          metadata: Json | null;
          name: string | null;
          page_url: string | null;
          phone: string | null;
          services: string[] | null;
          source: string | null;
          source_platform: string | null;
          status: string | null;
          tag: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          city?: string | null;
          company?: string | null;
          consent?: boolean | null;
          created_at?: string | null;
          details?: string | null;
          email?: string | null;
          fbclid?: string | null;
          gclid?: string | null;
          id?: string;
          message?: string | null;
          metadata?: Json | null;
          name?: string | null;
          page_url?: string | null;
          phone?: string | null;
          services?: string[] | null;
          source?: string | null;
          source_platform?: string | null;
          status?: string | null;
          tag?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          city?: string | null;
          company?: string | null;
          consent?: boolean | null;
          created_at?: string | null;
          details?: string | null;
          email?: string | null;
          fbclid?: string | null;
          gclid?: string | null;
          id?: string;
          message?: string | null;
          metadata?: Json | null;
          name?: string | null;
          page_url?: string | null;
          phone?: string | null;
          services?: string[] | null;
          source?: string | null;
          source_platform?: string | null;
          status?: string | null;
          tag?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string | null;
          data: Json | null;
          id: string;
          message: string;
          read: boolean | null;
          severity: string | null;
          title: string;
          type: string;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          message: string;
          read?: boolean | null;
          severity?: string | null;
          title: string;
          type: string;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          message?: string;
          read?: boolean | null;
          severity?: string | null;
          title?: string;
          type?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          email: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          email: string;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          email?: string;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          after_label: string | null;
          before_label: string | null;
          city: string;
          created_at: string | null;
          featured: boolean | null;
          id: string;
          mux_asset_id: string | null;
          mux_playback_id: string | null;
          published: boolean | null;
          service: string;
          sort_order: number | null;
          tags: string[] | null;
          thumbnail_url: string | null;
          title: string;
          youtube_id: string | null;
        };
        Insert: {
          after_label?: string | null;
          before_label?: string | null;
          city: string;
          created_at?: string | null;
          featured?: boolean | null;
          id?: string;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          published?: boolean | null;
          service: string;
          sort_order?: number | null;
          tags?: string[] | null;
          thumbnail_url?: string | null;
          title: string;
          youtube_id?: string | null;
        };
        Update: {
          after_label?: string | null;
          before_label?: string | null;
          city?: string;
          created_at?: string | null;
          featured?: boolean | null;
          id?: string;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          published?: boolean | null;
          service?: string;
          sort_order?: number | null;
          tags?: string[] | null;
          thumbnail_url?: string | null;
          title?: string;
          youtube_id?: string | null;
        };
        Relationships: [];
      };
      scheduled_reports: {
        Row: {
          created_at: string | null;
          day_of_week: number | null;
          enabled: boolean | null;
          frequency: string;
          hour: number | null;
          id: string;
          last_sent_at: string | null;
          name: string;
          recipients: Json;
          sections: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          day_of_week?: number | null;
          enabled?: boolean | null;
          frequency?: string;
          hour?: number | null;
          id?: string;
          last_sent_at?: string | null;
          name: string;
          recipients?: Json;
          sections?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          day_of_week?: number | null;
          enabled?: boolean | null;
          frequency?: string;
          hour?: number | null;
          id?: string;
          last_sent_at?: string | null;
          name?: string;
          recipients?: Json;
          sections?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      increment_post_views: { Args: { post_slug: string }; Returns: undefined };
      is_admin: { Args: never; Returns: boolean };
      log_admin_action: {
        Args: {
          p_action: string;
          p_details?: Json;
          p_entity_id?: string;
          p_entity_type?: string;
          p_status?: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin" | "editor" | "viewer";
      user_role: "admin" | "viewer";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
      user_role: ["admin", "viewer"],
    },
  },
} as const;
