export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      analytics_events: {
        Row: {
          country: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      export_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          export_type: string
          file_url: string | null
          id: string
          parameters: Json | null
          status: Database["public"]["Enums"]["export_status_enum"] | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          export_type: string
          file_url?: string | null
          id?: string
          parameters?: Json | null
          status?: Database["public"]["Enums"]["export_status_enum"] | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          export_type?: string
          file_url?: string | null
          id?: string
          parameters?: Json | null
          status?: Database["public"]["Enums"]["export_status_enum"] | null
          user_id?: string
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          color_hex: string | null
          created_at: string | null
          description_en: string | null
          description_fr: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          like_count: number | null
          parent_reply_id: string | null
          thread_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          like_count?: number | null
          parent_reply_id?: string | null
          thread_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          like_count?: number | null
          parent_reply_id?: string | null
          thread_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          language: Database["public"]["Enums"]["language_enum"] | null
          last_reply_at: string | null
          last_reply_by: string | null
          reply_count: number | null
          search_vector: unknown | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          last_reply_at?: string | null
          last_reply_by?: string | null
          reply_count?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          last_reply_at?: string | null
          last_reply_by?: string | null
          reply_count?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organisation_collaborations: {
        Row: {
          collaboration_type: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          organisation1_id: string
          organisation2_id: string
          start_date: string | null
        }
        Insert: {
          collaboration_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          organisation1_id: string
          organisation2_id: string
          start_date?: string | null
        }
        Update: {
          collaboration_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          organisation1_id?: string
          organisation2_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organisation_collaborations_organisation1_id_fkey"
            columns: ["organisation1_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_collaborations_organisation2_id_fkey"
            columns: ["organisation2_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          address: string | null
          annual_budget: number | null
          awards_recognition: string[] | null
          certifications: string[] | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: Database["public"]["Enums"]["country_enum"]
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          digital_tools: Json | null
          establishment_year: number | null
          featured: boolean | null
          geographic_coverage: string | null
          has_digital_tools: boolean | null
          id: string
          languages_spoken:
            | Database["public"]["Enums"]["language_enum"][]
            | null
          legal_status: string | null
          logo_url: string | null
          media_platforms: string[] | null
          media_uploads: Json | null
          media_work_types: string[] | null
          mission: string | null
          name: string
          network_memberships: string[] | null
          operational_levels: string[] | null
          other_countries: string[] | null
          partnerships: string[] | null
          primary_work_methods:
            | Database["public"]["Enums"]["work_method_enum"][]
            | null
          region: string | null
          registration_number: string | null
          search_vector: unknown | null
          size: Database["public"]["Enums"]["organisation_size_enum"]
          social_links: Json | null
          staff_count: number | null
          state_province: string | null
          status: Database["public"]["Enums"]["organisation_status_enum"] | null
          target_populations:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          tax_exemption_status: boolean | null
          thematic_focus: string[] | null
          type: Database["public"]["Enums"]["organisation_type_enum"]
          updated_at: string | null
          verified: boolean | null
          vision: string | null
          volunteer_count: number | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          annual_budget?: number | null
          awards_recognition?: string[] | null
          certifications?: string[] | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country: Database["public"]["Enums"]["country_enum"]
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          digital_tools?: Json | null
          establishment_year?: number | null
          featured?: boolean | null
          geographic_coverage?: string | null
          has_digital_tools?: boolean | null
          id?: string
          languages_spoken?:
            | Database["public"]["Enums"]["language_enum"][]
            | null
          legal_status?: string | null
          logo_url?: string | null
          media_platforms?: string[] | null
          media_uploads?: Json | null
          media_work_types?: string[] | null
          mission?: string | null
          name: string
          network_memberships?: string[] | null
          operational_levels?: string[] | null
          other_countries?: string[] | null
          partnerships?: string[] | null
          primary_work_methods?:
            | Database["public"]["Enums"]["work_method_enum"][]
            | null
          region?: string | null
          registration_number?: string | null
          search_vector?: unknown | null
          size: Database["public"]["Enums"]["organisation_size_enum"]
          social_links?: Json | null
          staff_count?: number | null
          state_province?: string | null
          status?:
            | Database["public"]["Enums"]["organisation_status_enum"]
            | null
          target_populations?:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          tax_exemption_status?: boolean | null
          thematic_focus?: string[] | null
          type: Database["public"]["Enums"]["organisation_type_enum"]
          updated_at?: string | null
          verified?: boolean | null
          vision?: string | null
          volunteer_count?: number | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          annual_budget?: number | null
          awards_recognition?: string[] | null
          certifications?: string[] | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country?: Database["public"]["Enums"]["country_enum"]
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          digital_tools?: Json | null
          establishment_year?: number | null
          featured?: boolean | null
          geographic_coverage?: string | null
          has_digital_tools?: boolean | null
          id?: string
          languages_spoken?:
            | Database["public"]["Enums"]["language_enum"][]
            | null
          legal_status?: string | null
          logo_url?: string | null
          media_platforms?: string[] | null
          media_uploads?: Json | null
          media_work_types?: string[] | null
          mission?: string | null
          name?: string
          network_memberships?: string[] | null
          operational_levels?: string[] | null
          other_countries?: string[] | null
          partnerships?: string[] | null
          primary_work_methods?:
            | Database["public"]["Enums"]["work_method_enum"][]
            | null
          region?: string | null
          registration_number?: string | null
          search_vector?: unknown | null
          size?: Database["public"]["Enums"]["organisation_size_enum"]
          social_links?: Json | null
          staff_count?: number | null
          state_province?: string | null
          status?:
            | Database["public"]["Enums"]["organisation_status_enum"]
            | null
          target_populations?:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          tax_exemption_status?: boolean | null
          thematic_focus?: string[] | null
          type?: Database["public"]["Enums"]["organisation_type_enum"]
          updated_at?: string | null
          verified?: boolean | null
          vision?: string | null
          volunteer_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content_en: string
          content_fr: string
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          meta_description_en: string | null
          meta_description_fr: string | null
          slug: string
          sort_order: number | null
          title_en: string
          title_fr: string
          updated_at: string | null
        }
        Insert: {
          content_en: string
          content_fr: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_fr?: string | null
          slug: string
          sort_order?: number | null
          title_en: string
          title_fr: string
          updated_at?: string | null
        }
        Update: {
          content_en?: string
          content_fr?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          meta_description_en?: string | null
          meta_description_fr?: string | null
          slug?: string
          sort_order?: number | null
          title_en?: string
          title_fr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          category: string | null
          comment_count: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          language: Database["public"]["Enums"]["language_enum"] | null
          like_count: number | null
          organisation_id: string | null
          project_id: string | null
          published_at: string | null
          search_vector: unknown | null
          status: Database["public"]["Enums"]["post_status_enum"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          like_count?: number | null
          organisation_id?: string | null
          project_id?: string | null
          published_at?: string | null
          search_vector?: unknown | null
          status?: Database["public"]["Enums"]["post_status_enum"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          like_count?: number | null
          organisation_id?: string | null
          project_id?: string | null
          published_at?: string | null
          search_vector?: unknown | null
          status?: Database["public"]["Enums"]["post_status_enum"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          email_verified: boolean | null
          id: string
          language_preference:
            | Database["public"]["Enums"]["language_enum"]
            | null
          last_login: string | null
          name: string
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          organisation_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role_enum"] | null
          social_links: Json | null
          timezone: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email_verified?: boolean | null
          id: string
          language_preference?:
            | Database["public"]["Enums"]["language_enum"]
            | null
          last_login?: string | null
          name: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          organisation_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"] | null
          social_links?: Json | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          email_verified?: boolean | null
          id?: string
          language_preference?:
            | Database["public"]["Enums"]["language_enum"]
            | null
          last_login?: string | null
          name?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          organisation_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"] | null
          social_links?: Json | null
          timezone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      project_events: {
        Row: {
          attachments: Json | null
          contact_email: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          current_participants: number | null
          description: string | null
          event_date: string
          event_end_date: string | null
          event_location: string | null
          event_status: string | null
          event_type: string | null
          id: string
          is_public: boolean | null
          is_virtual: boolean | null
          max_participants: number | null
          meeting_link: string | null
          project_id: string
          registration_deadline: string | null
          registration_link: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          venue_details: Json | null
        }
        Insert: {
          attachments?: Json | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          event_date: string
          event_end_date?: string | null
          event_location?: string | null
          event_status?: string | null
          event_type?: string | null
          id?: string
          is_public?: boolean | null
          is_virtual?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          project_id: string
          registration_deadline?: string | null
          registration_link?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          venue_details?: Json | null
        }
        Update: {
          attachments?: Json | null
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          event_date?: string
          event_end_date?: string | null
          event_location?: string | null
          event_status?: string | null
          event_type?: string | null
          id?: string
          is_public?: boolean | null
          is_virtual?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          project_id?: string
          registration_deadline?: string | null
          registration_link?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          venue_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "project_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_funders: {
        Row: {
          acknowledgment_required: boolean | null
          created_at: string | null
          currency: string | null
          funder_logo_url: string | null
          funder_name: string
          funder_type: string | null
          funder_website: string | null
          funding_amount: number | null
          funding_period_end: string | null
          funding_period_start: string | null
          funding_type: string | null
          id: string
          is_primary_funder: boolean | null
          project_id: string
          public_visibility: boolean | null
        }
        Insert: {
          acknowledgment_required?: boolean | null
          created_at?: string | null
          currency?: string | null
          funder_logo_url?: string | null
          funder_name: string
          funder_type?: string | null
          funder_website?: string | null
          funding_amount?: number | null
          funding_period_end?: string | null
          funding_period_start?: string | null
          funding_type?: string | null
          id?: string
          is_primary_funder?: boolean | null
          project_id: string
          public_visibility?: boolean | null
        }
        Update: {
          acknowledgment_required?: boolean | null
          created_at?: string | null
          currency?: string | null
          funder_logo_url?: string | null
          funder_name?: string
          funder_type?: string | null
          funder_website?: string | null
          funding_amount?: number | null
          funding_period_end?: string | null
          funding_period_start?: string | null
          funding_type?: string | null
          id?: string
          is_primary_funder?: boolean | null
          project_id?: string
          public_visibility?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "project_funders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          file_name: string | null
          file_size: number | null
          file_type: Database["public"]["Enums"]["file_type_enum"]
          file_url: string
          id: string
          is_featured: boolean | null
          mime_type: string | null
          project_id: string
          sort_order: number | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type: Database["public"]["Enums"]["file_type_enum"]
          file_url: string
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          project_id: string
          sort_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["file_type_enum"]
          file_url?: string
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          project_id?: string
          sort_order?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completion_date: string | null
          created_at: string | null
          created_by: string | null
          deliverables: string[] | null
          description: string | null
          due_date: string | null
          evidence_urls: string[] | null
          id: string
          notes: string | null
          progress_percentage: number | null
          project_id: string
          sort_order: number | null
          status: Database["public"]["Enums"]["milestone_status_enum"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          deliverables?: string[] | null
          description?: string | null
          due_date?: string | null
          evidence_urls?: string[] | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          project_id: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["milestone_status_enum"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          deliverables?: string[] | null
          description?: string | null
          due_date?: string | null
          evidence_urls?: string[] | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          project_id?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["milestone_status_enum"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          beneficiaries_count: number | null
          beneficiaries_demographics: Json | null
          budget: number | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          documents_urls: string[] | null
          end_date: string | null
          featured: boolean | null
          featured_image_url: string | null
          gallery_images: string[] | null
          geo_coordinates: Json | null
          id: string
          impact_metrics: Json | null
          language: Database["public"]["Enums"]["language_enum"] | null
          location: string | null
          objectives: string[] | null
          organisation_id: string
          outcomes: string[] | null
          project_website: string | null
          public_visibility: boolean | null
          sdg_goals: number[] | null
          search_vector: unknown | null
          secondary_sectors: string[] | null
          sector_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status_enum"] | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          beneficiaries_count?: number | null
          beneficiaries_demographics?: Json | null
          budget?: number | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          documents_urls?: string[] | null
          end_date?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          gallery_images?: string[] | null
          geo_coordinates?: Json | null
          id?: string
          impact_metrics?: Json | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          location?: string | null
          objectives?: string[] | null
          organisation_id: string
          outcomes?: string[] | null
          project_website?: string | null
          public_visibility?: boolean | null
          sdg_goals?: number[] | null
          search_vector?: unknown | null
          secondary_sectors?: string[] | null
          sector_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"] | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          beneficiaries_count?: number | null
          beneficiaries_demographics?: Json | null
          budget?: number | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          documents_urls?: string[] | null
          end_date?: string | null
          featured?: boolean | null
          featured_image_url?: string | null
          gallery_images?: string[] | null
          geo_coordinates?: Json | null
          id?: string
          impact_metrics?: Json | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          location?: string | null
          objectives?: string[] | null
          organisation_id?: string
          outcomes?: string[] | null
          project_website?: string | null
          public_visibility?: boolean | null
          sdg_goals?: number[] | null
          search_vector?: unknown | null
          secondary_sectors?: string[] | null
          sector_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status_enum"] | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role_enum"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          user_id?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          color_hex: string | null
          created_at: string | null
          description_en: string | null
          description_fr: string | null
          icon_url: string | null
          id: string
          name_en: string
          name_fr: string
          updated_at: string | null
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          icon_url?: string | null
          id?: string
          name_en: string
          name_fr: string
          updated_at?: string | null
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          icon_url?: string | null
          id?: string
          name_en?: string
          name_fr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string | null
          field_name: string
          id: string
          is_verified: boolean | null
          language: Database["public"]["Enums"]["language_enum"]
          record_id: string
          table_name: string
          translation: string
          translator_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          id?: string
          is_verified?: boolean | null
          language: Database["public"]["Enums"]["language_enum"]
          record_id: string
          table_name: string
          translation: string
          translator_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          id?: string
          is_verified?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"]
          record_id?: string
          table_name?: string
          translation?: string
          translator_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          favoritable_id: string
          favoritable_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          favoritable_id: string
          favoritable_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          favoritable_id?: string
          favoritable_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      get_user_organisation_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role_enum"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_cso_rep: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_organisation: {
        Args: { org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      country_enum: "Nigeria" | "Benin" | "Gambia"
      export_status_enum: "pending" | "processing" | "completed" | "failed"
      file_type_enum: "image" | "pdf" | "video" | "audio" | "document" | "other"
      language_enum: "English" | "French"
      milestone_status_enum:
        | "planned"
        | "in_progress"
        | "achieved"
        | "delayed"
        | "cancelled"
      organisation_size_enum:
        | "Local"
        | "National"
        | "Regional"
        | "International"
      organisation_status_enum:
        | "active"
        | "pending_approval"
        | "flagged"
        | "inactive"
      organisation_type_enum:
        | "NGO"
        | "CBO"
        | "Network"
        | "Foundation"
        | "Coalition"
        | "Association"
        | "Cooperative"
        | "Other"
      post_status_enum: "draft" | "published" | "archived" | "flagged"
      project_status_enum:
        | "planning"
        | "ongoing"
        | "completed"
        | "cancelled"
        | "on_hold"
      target_population_enum:
        | "youth"
        | "women"
        | "people_living_with_disability"
        | "children"
        | "adolescents"
        | "men"
        | "older_persons"
        | "students"
        | "faith_leaders"
        | "traditional_leaders"
        | "community_leaders"
        | "policy_makers"
        | "journalists_media"
        | "researchers"
        | "civil_society_organizations"
        | "minority_groups"
        | "vulnerable_groups"
        | "idps_refugees"
        | "prisoners"
        | "consumers"
        | "general_public"
        | "voting_population"
        | "out_of_school_children"
        | "rural_populations"
        | "marginalized_communities"
        | "other"
      user_role_enum:
        | "admin"
        | "cso_rep"
        | "donor"
        | "media"
        | "policy_maker"
        | "public"
      work_method_enum:
        | "production_reports_policies"
        | "fact_checking"
        | "data_collection_analysis"
        | "advocacy_awareness_campaigns"
        | "training_capacity_building"
        | "social_dialogue_community_dialogue"
        | "organizing_conferences_seminars"
        | "election_monitoring_observation"
        | "networking_partnerships"
        | "documentation_needs_assessment"
        | "consultancy_outreach_support"
        | "media_content_production"
        | "mobile_app_development"
        | "summer_coaching_camps"
        | "skill_acquisition_training"
        | "deradicalization_empowerment"
        | "child_protection_services"
        | "other"
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
      country_enum: ["Nigeria", "Benin", "Gambia"],
      export_status_enum: ["pending", "processing", "completed", "failed"],
      file_type_enum: ["image", "pdf", "video", "audio", "document", "other"],
      language_enum: ["English", "French"],
      milestone_status_enum: [
        "planned",
        "in_progress",
        "achieved",
        "delayed",
        "cancelled",
      ],
      organisation_size_enum: [
        "Local",
        "National",
        "Regional",
        "International",
      ],
      organisation_status_enum: [
        "active",
        "pending_approval",
        "flagged",
        "inactive",
      ],
      organisation_type_enum: [
        "NGO",
        "CBO",
        "Network",
        "Foundation",
        "Coalition",
        "Association",
        "Cooperative",
        "Other",
      ],
      post_status_enum: ["draft", "published", "archived", "flagged"],
      project_status_enum: [
        "planning",
        "ongoing",
        "completed",
        "cancelled",
        "on_hold",
      ],
      target_population_enum: [
        "youth",
        "women",
        "people_living_with_disability",
        "children",
        "adolescents",
        "men",
        "older_persons",
        "students",
        "faith_leaders",
        "traditional_leaders",
        "community_leaders",
        "policy_makers",
        "journalists_media",
        "researchers",
        "civil_society_organizations",
        "minority_groups",
        "vulnerable_groups",
        "idps_refugees",
        "prisoners",
        "consumers",
        "general_public",
        "voting_population",
        "out_of_school_children",
        "rural_populations",
        "marginalized_communities",
        "other",
      ],
      user_role_enum: [
        "admin",
        "cso_rep",
        "donor",
        "media",
        "policy_maker",
        "public",
      ],
      work_method_enum: [
        "production_reports_policies",
        "fact_checking",
        "data_collection_analysis",
        "advocacy_awareness_campaigns",
        "training_capacity_building",
        "social_dialogue_community_dialogue",
        "organizing_conferences_seminars",
        "election_monitoring_observation",
        "networking_partnerships",
        "documentation_needs_assessment",
        "consultancy_outreach_support",
        "media_content_production",
        "mobile_app_development",
        "summer_coaching_camps",
        "skill_acquisition_training",
        "deradicalization_empowerment",
        "child_protection_services",
        "other",
      ],
    },
  },
} as const
