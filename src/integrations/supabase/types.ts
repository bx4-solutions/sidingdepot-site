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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
        }
        Relationships: []
      }
      alert_rules: {
        Row: {
          condition: Json
          created_at: string | null
          enabled: boolean | null
          id: string
          name: string
          type: string
        }
        Insert: {
          condition: Json
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          type: string
        }
        Update: {
          condition?: Json
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          event_type: string
          fbclid: string | null
          gclid: string | null
          id: string
          lat: number | null
          lon: number | null
          os: string | null
          page_path: string
          page_title: string | null
          referrer: string | null
          region: string | null
          screen_height: number | null
          screen_width: number | null
          scroll_depth: number | null
          session_id: string
          source_platform: string | null
          time_on_page: number | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_type: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          lat?: number | null
          lon?: number | null
          os?: string | null
          page_path: string
          page_title?: string | null
          referrer?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          scroll_depth?: number | null
          session_id: string
          source_platform?: string | null
          time_on_page?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_type?: string
          fbclid?: string | null
          gclid?: string | null
          id?: string
          lat?: number | null
          lon?: number | null
          os?: string | null
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          scroll_depth?: number | null
          session_id?: string
          source_platform?: string | null
          time_on_page?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string | null
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
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          author_id: string | null
          category: string | null
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time: number | null
          schema_json: string | null
          slug: string
          status: string | null
          suggested_date: string | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number | null
          schema_json?: string | null
          slug: string
          status?: string | null
          suggested_date?: string | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author?: string | null
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time?: number | null
          schema_json?: string | null
          slug?: string
          status?: string | null
          suggested_date?: string | null
          title?: string
          updated_at?: string
          views?: number | null
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
      dashboard_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      google_ads_accounts: {
        Row: {
          created_at: string
          currency_code: string | null
          customer_id: string
          display_name: string
          is_active: boolean
          last_synced_at: string | null
          time_zone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string | null
          customer_id: string
          display_name: string
          is_active?: boolean
          last_synced_at?: string | null
          time_zone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string | null
          customer_id?: string
          display_name?: string
          is_active?: boolean
          last_synced_at?: string | null
          time_zone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      google_ads_campaign_metrics: {
        Row: {
          campaign_channel_type: string | null
          campaign_id: string
          campaign_name: string
          campaign_status: string
          clicks: number
          conversion_value: number
          conversions: number
          cost_micros: number
          customer_id: string
          impressions: number
          metric_date: string
        }
        Insert: {
          campaign_channel_type?: string | null
          campaign_id: string
          campaign_name: string
          campaign_status: string
          clicks?: number
          conversion_value?: number
          conversions?: number
          cost_micros?: number
          customer_id: string
          impressions?: number
          metric_date: string
        }
        Update: {
          campaign_channel_type?: string | null
          campaign_id?: string
          campaign_name?: string
          campaign_status?: string
          clicks?: number
          conversion_value?: number
          conversions?: number
          cost_micros?: number
          customer_id?: string
          impressions?: number
          metric_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_ads_campaign_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "google_ads_accounts"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      google_ads_daily_metrics: {
        Row: {
          clicks: number
          conversion_value: number
          conversions: number
          cost_micros: number
          customer_id: string
          impressions: number
          metric_date: string
        }
        Insert: {
          clicks?: number
          conversion_value?: number
          conversions?: number
          cost_micros?: number
          customer_id: string
          impressions?: number
          metric_date: string
        }
        Update: {
          clicks?: number
          conversion_value?: number
          conversions?: number
          cost_micros?: number
          customer_id?: string
          impressions?: number
          metric_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_ads_daily_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "google_ads_accounts"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      google_ads_sync_runs: {
        Row: {
          completed_at: string | null
          customer_id: string | null
          error_message: string | null
          id: string
          records_synced: number
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          records_synced?: number
          started_at?: string
          status: string
        }
        Update: {
          completed_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          id?: string
          records_synced?: number
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_ads_sync_runs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "google_ads_accounts"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      google_place_stats: {
        Row: {
          fetched_at: string
          id: number
          rating: number
          total_reviews: number
        }
        Insert: {
          fetched_at?: string
          id?: number
          rating?: number
          total_reviews?: number
        }
        Update: {
          fetched_at?: string
          id?: number
          rating?: number
          total_reviews?: number
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
      landing_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          images: Json
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          images?: Json
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          images?: Json
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          browser: string | null
          city: string | null
          close_date: string | null
          company: string | null
          consent: boolean | null
          created_at: string | null
          details: string | null
          device_type: string | null
          email: string | null
          fbclid: string | null
          gclid: string | null
          ghl_contact_id: string | null
          ghl_opportunity_id: string | null
          ghl_response: Json | null
          ghl_synced_at: string | null
          id: string
          landing_page: string | null
          message: string | null
          metadata: Json | null
          name: string | null
          opportunity_status: string | null
          opportunity_value: number | null
          os: string | null
          page_url: string | null
          phone: string | null
          pipeline_stage: string | null
          referrer: string | null
          services: string[] | null
          source: string | null
          source_platform: string | null
          status: string | null
          tag: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          close_date?: string | null
          company?: string | null
          consent?: boolean | null
          created_at?: string | null
          details?: string | null
          device_type?: string | null
          email?: string | null
          fbclid?: string | null
          gclid?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          ghl_response?: Json | null
          ghl_synced_at?: string | null
          id?: string
          landing_page?: string | null
          message?: string | null
          metadata?: Json | null
          name?: string | null
          opportunity_status?: string | null
          opportunity_value?: number | null
          os?: string | null
          page_url?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          referrer?: string | null
          services?: string[] | null
          source?: string | null
          source_platform?: string | null
          status?: string | null
          tag?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          close_date?: string | null
          company?: string | null
          consent?: boolean | null
          created_at?: string | null
          details?: string | null
          device_type?: string | null
          email?: string | null
          fbclid?: string | null
          gclid?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          ghl_response?: Json | null
          ghl_synced_at?: string | null
          id?: string
          landing_page?: string | null
          message?: string | null
          metadata?: Json | null
          name?: string | null
          opportunity_status?: string | null
          opportunity_value?: number | null
          os?: string | null
          page_url?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          referrer?: string | null
          services?: string[] | null
          source?: string | null
          source_platform?: string | null
          status?: string | null
          tag?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      lp_ab_sessions: {
        Row: {
          converted: boolean
          created_at: string
          id: string
          session_id: string
          test_id: string
          variant: string
        }
        Insert: {
          converted?: boolean
          created_at?: string
          id?: string
          session_id: string
          test_id: string
          variant: string
        }
        Update: {
          converted?: boolean
          created_at?: string
          id?: string
          session_id?: string
          test_id?: string
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "lp_ab_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "lp_ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      lp_ab_tests: {
        Row: {
          confidence_level: number
          created_at: string
          end_date: string | null
          goal_target: string | null
          goal_type: string
          id: string
          landing_page_id: string
          name: string
          start_date: string | null
          status: string
          traffic_split: number
          updated_at: string
          variant_a_content: Json | null
          variant_a_conversions: number
          variant_a_views: number
          variant_b_content: Json
          variant_b_conversions: number
          variant_b_views: number
          winner: string | null
        }
        Insert: {
          confidence_level?: number
          created_at?: string
          end_date?: string | null
          goal_target?: string | null
          goal_type?: string
          id?: string
          landing_page_id: string
          name: string
          start_date?: string | null
          status?: string
          traffic_split?: number
          updated_at?: string
          variant_a_content?: Json | null
          variant_a_conversions?: number
          variant_a_views?: number
          variant_b_content?: Json
          variant_b_conversions?: number
          variant_b_views?: number
          winner?: string | null
        }
        Update: {
          confidence_level?: number
          created_at?: string
          end_date?: string | null
          goal_target?: string | null
          goal_type?: string
          id?: string
          landing_page_id?: string
          name?: string
          start_date?: string | null
          status?: string
          traffic_split?: number
          updated_at?: string
          variant_a_content?: Json | null
          variant_a_conversions?: number
          variant_a_views?: number
          variant_b_content?: Json
          variant_b_conversions?: number
          variant_b_views?: number
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lp_ab_tests_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      lp_campaigns: {
        Row: {
          avg_conversion_value: number
          created_at: string
          currency: string
          end_date: string
          goal_conversions: number | null
          goal_pageviews: number | null
          goal_reach: number | null
          goal_revenue: number | null
          goal_visitors: number | null
          id: string
          landing_page_id: string | null
          name: string
          page_path: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          avg_conversion_value?: number
          created_at?: string
          currency?: string
          end_date: string
          goal_conversions?: number | null
          goal_pageviews?: number | null
          goal_reach?: number | null
          goal_revenue?: number | null
          goal_visitors?: number | null
          id?: string
          landing_page_id?: string | null
          name: string
          page_path?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          avg_conversion_value?: number
          created_at?: string
          currency?: string
          end_date?: string
          goal_conversions?: number | null
          goal_pageviews?: number | null
          goal_reach?: number | null
          goal_revenue?: number | null
          goal_visitors?: number | null
          id?: string
          landing_page_id?: string | null
          name?: string
          page_path?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lp_campaigns_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_ads_accounts: {
        Row: {
          account_id: string
          account_status: string | null
          created_at: string
          currency_code: string
          display_name: string
          is_active: boolean
          last_synced_at: string | null
          time_zone: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          account_status?: string | null
          created_at?: string
          currency_code?: string
          display_name: string
          is_active?: boolean
          last_synced_at?: string | null
          time_zone?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          account_status?: string | null
          created_at?: string
          currency_code?: string
          display_name?: string
          is_active?: boolean
          last_synced_at?: string | null
          time_zone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      meta_ads_ad_metrics: {
        Row: {
          account_id: string
          ad_id: string
          ad_name: string
          ad_status: string | null
          adset_id: string
          adset_name: string
          campaign_id: string
          campaign_name: string
          clicks: number
          creative_id: string | null
          impressions: number
          inline_link_clicks: number
          leads: number
          metric_date: string
          reach: number
          spend: number
        }
        Insert: {
          account_id: string
          ad_id: string
          ad_name: string
          ad_status?: string | null
          adset_id: string
          adset_name: string
          campaign_id: string
          campaign_name: string
          clicks?: number
          creative_id?: string | null
          impressions?: number
          inline_link_clicks?: number
          leads?: number
          metric_date: string
          reach?: number
          spend?: number
        }
        Update: {
          account_id?: string
          ad_id?: string
          ad_name?: string
          ad_status?: string | null
          adset_id?: string
          adset_name?: string
          campaign_id?: string
          campaign_name?: string
          clicks?: number
          creative_id?: string | null
          impressions?: number
          inline_link_clicks?: number
          leads?: number
          metric_date?: string
          reach?: number
          spend?: number
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_ad_metrics_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "meta_ads_accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      meta_ads_adset_metrics: {
        Row: {
          account_id: string
          adset_id: string
          adset_name: string
          adset_status: string | null
          campaign_id: string
          campaign_name: string
          clicks: number
          impressions: number
          inline_link_clicks: number
          leads: number
          metric_date: string
          reach: number
          spend: number
        }
        Insert: {
          account_id: string
          adset_id: string
          adset_name: string
          adset_status?: string | null
          campaign_id: string
          campaign_name: string
          clicks?: number
          impressions?: number
          inline_link_clicks?: number
          leads?: number
          metric_date: string
          reach?: number
          spend?: number
        }
        Update: {
          account_id?: string
          adset_id?: string
          adset_name?: string
          adset_status?: string | null
          campaign_id?: string
          campaign_name?: string
          clicks?: number
          impressions?: number
          inline_link_clicks?: number
          leads?: number
          metric_date?: string
          reach?: number
          spend?: number
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_adset_metrics_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "meta_ads_accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      meta_ads_campaign_metrics: {
        Row: {
          account_id: string
          campaign_id: string
          campaign_name: string
          campaign_status: string | null
          clicks: number
          impressions: number
          inline_link_clicks: number
          leads: number
          metric_date: string
          objective: string | null
          reach: number
          spend: number
        }
        Insert: {
          account_id: string
          campaign_id: string
          campaign_name: string
          campaign_status?: string | null
          clicks?: number
          impressions?: number
          inline_link_clicks?: number
          leads?: number
          metric_date: string
          objective?: string | null
          reach?: number
          spend?: number
        }
        Update: {
          account_id?: string
          campaign_id?: string
          campaign_name?: string
          campaign_status?: string | null
          clicks?: number
          impressions?: number
          inline_link_clicks?: number
          leads?: number
          metric_date?: string
          objective?: string | null
          reach?: number
          spend?: number
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_campaign_metrics_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "meta_ads_accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      meta_ads_creatives: {
        Row: {
          account_id: string
          ad_id: string
          body: string | null
          call_to_action_type: string | null
          creative_id: string
          creative_name: string | null
          image_url: string | null
          last_synced_at: string
          link_url: string | null
          raw_creative: Json
          thumbnail_url: string | null
          title: string | null
          video_id: string | null
        }
        Insert: {
          account_id: string
          ad_id: string
          body?: string | null
          call_to_action_type?: string | null
          creative_id: string
          creative_name?: string | null
          image_url?: string | null
          last_synced_at?: string
          link_url?: string | null
          raw_creative?: Json
          thumbnail_url?: string | null
          title?: string | null
          video_id?: string | null
        }
        Update: {
          account_id?: string
          ad_id?: string
          body?: string | null
          call_to_action_type?: string | null
          creative_id?: string
          creative_name?: string | null
          image_url?: string | null
          last_synced_at?: string
          link_url?: string | null
          raw_creative?: Json
          thumbnail_url?: string | null
          title?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_creatives_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "meta_ads_accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      meta_ads_sync_runs: {
        Row: {
          account_id: string | null
          completed_at: string | null
          error_message: string | null
          id: string
          records_synced: number
          started_at: string
          status: string
        }
        Insert: {
          account_id?: string | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_synced?: number
          started_at?: string
          status: string
        }
        Update: {
          account_id?: string | null
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_synced?: number
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_sync_runs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "meta_ads_accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          severity?: string | null
          title?: string
          type?: string
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
      projects: {
        Row: {
          after_label: string | null
          before_after: Json
          before_label: string | null
          city: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          gallery_images: Json
          id: string
          media_type: string
          mux_asset_id: string | null
          mux_playback_id: string | null
          published: boolean | null
          service: string
          sort_order: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          youtube_id: string | null
        }
        Insert: {
          after_label?: string | null
          before_after?: Json
          before_label?: string | null
          city: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          gallery_images?: Json
          id?: string
          media_type?: string
          mux_asset_id?: string | null
          mux_playback_id?: string | null
          published?: boolean | null
          service: string
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          youtube_id?: string | null
        }
        Update: {
          after_label?: string | null
          before_after?: Json
          before_label?: string | null
          city?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          gallery_images?: Json
          id?: string
          media_type?: string
          mux_asset_id?: string | null
          mux_playback_id?: string | null
          published?: boolean | null
          service?: string
          sort_order?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          youtube_id?: string | null
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          enabled: boolean | null
          frequency: string
          hour: number | null
          id: string
          last_sent_at: string | null
          name: string
          recipients: Json
          sections: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          enabled?: boolean | null
          frequency?: string
          hour?: number | null
          id?: string
          last_sent_at?: string | null
          name: string
          recipients?: Json
          sections?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          enabled?: boolean | null
          frequency?: string
          hour?: number | null
          id?: string
          last_sent_at?: string | null
          name?: string
          recipients?: Json
          sections?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          label: string | null
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          label?: string | null
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          label?: string | null
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_ab_views: {
        Args: { p_test_id: string; p_variant: string }
        Returns: undefined
      }
      increment_post_views: { Args: { post_slug: string }; Returns: undefined }
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
      record_ab_conversion: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      record_ghl_lead: {
        Args: {
          city?: string
          email?: string
          message?: string
          metadata?: Json
          name?: string
          page_url?: string
          phone?: string
          services?: string[]
          utm_campaign?: string
          utm_medium?: string
          utm_source?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
      user_role: ["admin", "viewer"],
    },
  },
} as const
