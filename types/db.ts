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
    PostgrestVersion: "13.0.4"
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
      blog_post_comment_likes: {
        Row: {
          anonymous_identifier: string | null
          comment_id: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          anonymous_identifier?: string | null
          comment_id: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          anonymous_identifier?: string | null
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_comments: {
        Row: {
          anonymous_identifier: string | null
          author_email: string | null
          author_id: string | null
          author_name: string | null
          blog_post_id: string
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status:
            | Database["public"]["Enums"]["comment_moderation_status_enum"]
            | null
          parent_comment_id: string | null
          updated_at: string | null
        }
        Insert: {
          anonymous_identifier?: string | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          blog_post_id: string
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["comment_moderation_status_enum"]
            | null
          parent_comment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          anonymous_identifier?: string | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          blog_post_id?: string
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["comment_moderation_status_enum"]
            | null
          parent_comment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comments_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comments_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_post_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_likes: {
        Row: {
          anonymous_identifier: string | null
          blog_post_id: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          anonymous_identifier?: string | null
          blog_post_id: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          anonymous_identifier?: string | null
          blog_post_id?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_media: {
        Row: {
          alt_text: string | null
          blog_post_id: string
          caption: string | null
          file_name: string | null
          file_size: number | null
          file_type: Database["public"]["Enums"]["file_type_enum"] | null
          file_url: string
          id: string
          mime_type: string | null
          sort_order: number | null
          storage_path: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          blog_post_id: string
          caption?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["file_type_enum"] | null
          file_url: string
          id?: string
          mime_type?: string | null
          sort_order?: number | null
          storage_path?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          blog_post_id?: string
          caption?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["file_type_enum"] | null
          file_url?: string
          id?: string
          mime_type?: string | null
          sort_order?: number | null
          storage_path?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_media_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          comment_count: number | null
          content: Json
          content_html: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_alt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          language: Database["public"]["Enums"]["language_enum"] | null
          like_count: number | null
          meta_description: string | null
          meta_title: string | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status:
            | Database["public"]["Enums"]["blog_moderation_status_enum"]
            | null
          organisation_id: string
          published_at: string | null
          reading_time_minutes: number | null
          scheduled_for: string | null
          search_vector: unknown | null
          slug: string
          status: Database["public"]["Enums"]["post_status_enum"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          comment_count?: number | null
          content: Json
          content_html?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          like_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["blog_moderation_status_enum"]
            | null
          organisation_id: string
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          search_vector?: unknown | null
          slug: string
          status?: Database["public"]["Enums"]["post_status_enum"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          comment_count?: number | null
          content?: Json
          content_html?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          like_count?: number | null
          meta_description?: string | null
          meta_title?: string | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["blog_moderation_status_enum"]
            | null
          organisation_id?: string
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          search_vector?: unknown | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status_enum"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          event_date: string
          event_end_date: string | null
          event_type: string | null
          event_website: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_virtual: boolean | null
          is_visible: boolean | null
          location: string | null
          max_participants: number | null
          meeting_url: string | null
          registration_url: string | null
          tags: string | null
          title: string
          updated_at: string | null
          venue_name: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          event_date: string
          event_end_date?: string | null
          event_type?: string | null
          event_website?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_virtual?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          registration_url?: string | null
          tags?: string | null
          title: string
          updated_at?: string | null
          venue_name?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_end_date?: string | null
          event_type?: string | null
          event_website?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_virtual?: boolean | null
          is_visible?: boolean | null
          location?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          registration_url?: string | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          venue_name?: string | null
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
          description_es: string | null
          description_fr: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_es: string | null
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          color_hex?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_es?: string | null
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          color_hex?: string | null
          created_at?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_es?: string | null
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      forum_media: {
        Row: {
          alt_text: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_featured: boolean | null
          mime_type: string | null
          reply_id: string | null
          sort_order: number | null
          storage_path: string | null
          thread_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          reply_id?: string | null
          sort_order?: number | null
          storage_path?: string | null
          thread_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          reply_id?: string | null
          sort_order?: number | null
          storage_path?: string | null
          thread_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_media_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_media_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          like_count: number | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status:
            | Database["public"]["Enums"]["forum_moderation_status_enum"]
            | null
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
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["forum_moderation_status_enum"]
            | null
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
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["forum_moderation_status_enum"]
            | null
          parent_reply_id?: string | null
          thread_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      forum_reply_likes: {
        Row: {
          created_at: string | null
          id: string
          reply_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reply_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reply_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_reply_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_thread_likes: {
        Row: {
          created_at: string | null
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_thread_likes_thread_id_fkey"
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
          like_count: number | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          moderation_status:
            | Database["public"]["Enums"]["forum_moderation_status_enum"]
            | null
          organisation_id: string | null
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
          like_count?: number | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["forum_moderation_status_enum"]
            | null
          organisation_id?: string | null
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
          like_count?: number | null
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          moderation_status?:
            | Database["public"]["Enums"]["forum_moderation_status_enum"]
            | null
          organisation_id?: string | null
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
          {
            foreignKeyName: "forum_threads_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_opportunities: {
        Row: {
          application_deadline: string | null
          application_requirements: string[] | null
          application_url: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          eligibility_criteria: string | null
          featured_image_url: string | null
          funder_contact_email: string | null
          funder_contact_person: string | null
          funder_description: string | null
          funder_logo_url: string | null
          funder_name: string
          funder_type:
            | Database["public"]["Enums"]["funding_source_type_enum"]
            | null
          funder_website: string | null
          funding_amount_max: number | null
          funding_amount_min: number | null
          funding_duration_months: number | null
          funding_period_end: string | null
          funding_period_start: string | null
          geographic_focus:
            | Database["public"]["Enums"]["geographic_focus_enum"][]
            | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          is_visible: boolean | null
          language: Database["public"]["Enums"]["language_enum"] | null
          opportunity_type: Database["public"]["Enums"]["opportunity_type_enum"]
          search_vector: unknown | null
          selection_criteria: string | null
          slug: string
          status: Database["public"]["Enums"]["opportunity_status_enum"] | null
          summary: string | null
          tags: string[] | null
          target_countries: string[] | null
          target_populations:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          thematic_areas: string[] | null
          title: string
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
          view_count: number | null
        }
        Insert: {
          application_deadline?: string | null
          application_requirements?: string[] | null
          application_url?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          featured_image_url?: string | null
          funder_contact_email?: string | null
          funder_contact_person?: string | null
          funder_description?: string | null
          funder_logo_url?: string | null
          funder_name: string
          funder_type?:
            | Database["public"]["Enums"]["funding_source_type_enum"]
            | null
          funder_website?: string | null
          funding_amount_max?: number | null
          funding_amount_min?: number | null
          funding_duration_months?: number | null
          funding_period_end?: string | null
          funding_period_start?: string | null
          geographic_focus?:
            | Database["public"]["Enums"]["geographic_focus_enum"][]
            | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          is_visible?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          opportunity_type: Database["public"]["Enums"]["opportunity_type_enum"]
          search_vector?: unknown | null
          selection_criteria?: string | null
          slug: string
          status?: Database["public"]["Enums"]["opportunity_status_enum"] | null
          summary?: string | null
          tags?: string[] | null
          target_countries?: string[] | null
          target_populations?:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          thematic_areas?: string[] | null
          title: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          view_count?: number | null
        }
        Update: {
          application_deadline?: string | null
          application_requirements?: string[] | null
          application_url?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          featured_image_url?: string | null
          funder_contact_email?: string | null
          funder_contact_person?: string | null
          funder_description?: string | null
          funder_logo_url?: string | null
          funder_name?: string
          funder_type?:
            | Database["public"]["Enums"]["funding_source_type_enum"]
            | null
          funder_website?: string | null
          funding_amount_max?: number | null
          funding_amount_min?: number | null
          funding_duration_months?: number | null
          funding_period_end?: string | null
          funding_period_start?: string | null
          geographic_focus?:
            | Database["public"]["Enums"]["geographic_focus_enum"][]
            | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          is_visible?: boolean | null
          language?: Database["public"]["Enums"]["language_enum"] | null
          opportunity_type?: Database["public"]["Enums"]["opportunity_type_enum"]
          search_vector?: unknown | null
          selection_criteria?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["opportunity_status_enum"] | null
          summary?: string | null
          tags?: string[] | null
          target_countries?: string[] | null
          target_populations?:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          thematic_areas?: string[] | null
          title?: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          view_count?: number | null
        }
        Relationships: []
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
      online_courses: {
        Row: {
          course_url: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          image_url: string | null
          instructor_name: string | null
          is_featured: boolean | null
          is_visible: boolean | null
          platform_name: string | null
          tags: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_url: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_name?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          platform_name?: string | null
          tags?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_url?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          image_url?: string | null
          instructor_name?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          platform_name?: string | null
          tags?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organisation_affiliation_requests: {
        Row: {
          admin_response: string | null
          created_at: string | null
          id: string
          organisation_id: string
          request_message: string | null
          request_status:
            | Database["public"]["Enums"]["organisation_affiliation_status_enum"]
            | null
          requested_at: string | null
          responded_at: string | null
          responded_by: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          organisation_id: string
          request_message?: string | null
          request_status?:
            | Database["public"]["Enums"]["organisation_affiliation_status_enum"]
            | null
          requested_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          id?: string
          organisation_id?: string
          request_message?: string | null
          request_status?:
            | Database["public"]["Enums"]["organisation_affiliation_status_enum"]
            | null
          requested_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_affiliation_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_affiliation_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_affiliation_requests_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_affiliation_requests_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_affiliation_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_affiliation_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "admin_organisations"
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
          created_by: string | null
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
          created_by?: string | null
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
          created_by?: string | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          id: string
          language_preference:
            | Database["public"]["Enums"]["language_enum"]
            | null
          name: string
          notification_preferences: Json | null
          organisation_id: string | null
          phone: string | null
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
          id: string
          language_preference?:
            | Database["public"]["Enums"]["language_enum"]
            | null
          name: string
          notification_preferences?: Json | null
          organisation_id?: string | null
          phone?: string | null
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
          id?: string
          language_preference?:
            | Database["public"]["Enums"]["language_enum"]
            | null
          name?: string
          notification_preferences?: Json | null
          organisation_id?: string | null
          phone?: string | null
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
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
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
      resource_library: {
        Row: {
          author_name: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_visible: boolean | null
          resource_type: string
          tags: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          resource_type: string
          tags?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          resource_type?: string
          tags?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      admin_organisations: {
        Row: {
          address: string | null
          annual_budget: number | null
          awards_recognition: string[] | null
          certifications: string[] | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          country: Database["public"]["Enums"]["country_enum"] | null
          cover_image_url: string | null
          created_at: string | null
          created_by: string | null
          creator_name: string | null
          digital_tools: Json | null
          establishment_year: number | null
          featured: boolean | null
          geographic_coverage: string | null
          has_digital_tools: boolean | null
          id: string | null
          languages_spoken:
            | Database["public"]["Enums"]["language_enum"][]
            | null
          legal_status: string | null
          logo_url: string | null
          media_platforms: string[] | null
          media_uploads: Json | null
          media_work_types: string[] | null
          mission: string | null
          name: string | null
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
          size: Database["public"]["Enums"]["organisation_size_enum"] | null
          social_links: Json | null
          staff_count: number | null
          state_province: string | null
          status: Database["public"]["Enums"]["organisation_status_enum"] | null
          target_populations:
            | Database["public"]["Enums"]["target_population_enum"][]
            | null
          tax_exemption_status: boolean | null
          thematic_focus: string[] | null
          type: Database["public"]["Enums"]["organisation_type_enum"] | null
          updated_at: string | null
          verified: boolean | null
          vision: string | null
          volunteer_count: number | null
          website_url: string | null
        }
        Relationships: []
      }
      admin_users_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string | null
          name: string | null
          organisation_id: string | null
          organisation_name: string | null
          role: Database["public"]["Enums"]["user_role_enum"] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "admin_organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_get_forum_thread_replies: {
        Args: {
          limit_param?: number
          offset_param?: number
          thread_id_param: string
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          child_replies_count: number
          content: string
          created_at: string
          id: string
          is_solution: boolean
          like_count: number
          moderated_at: string
          moderated_by: string
          moderated_by_name: string
          moderation_notes: string
          moderation_status: Database["public"]["Enums"]["forum_moderation_status_enum"]
          parent_reply_id: string
          thread_id: string
          updated_at: string
          user_has_liked: boolean
        }[]
      }
      admin_get_forum_thread_with_likes: {
        Args: { thread_id_param: string }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          category_color_hex: string
          category_icon: string
          category_id: string
          category_name_en: string
          category_name_es: string
          category_name_fr: string
          content: string
          created_at: string
          id: string
          language: string
          like_count: number
          media: Json
          moderated_at: string
          moderated_by: string
          moderated_by_name: string
          moderation_notes: string
          moderation_status: Database["public"]["Enums"]["forum_moderation_status_enum"]
          organisation_id: string
          organisation_logo_url: string
          organisation_name: string
          reply_count: number
          tags: string[]
          title: string
          updated_at: string
          user_has_liked: boolean
          view_count: number
        }[]
      }
      admin_get_forum_threads_with_likes: {
        Args: {
          category_id_param?: string
          limit_param?: number
          offset_param?: number
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          category_color_hex: string
          category_icon: string
          category_id: string
          category_name_en: string
          category_name_es: string
          category_name_fr: string
          content: string
          created_at: string
          id: string
          language: string
          like_count: number
          media: Json
          moderated_at: string
          moderated_by: string
          moderated_by_name: string
          moderation_notes: string
          moderation_status: Database["public"]["Enums"]["forum_moderation_status_enum"]
          organisation_id: string
          organisation_logo_url: string
          organisation_name: string
          reply_count: number
          tags: string[]
          title: string
          updated_at: string
          user_has_liked: boolean
          view_count: number
        }[]
      }
      admin_moderate_blog_post: {
        Args: {
          admin_notes?: string
          blog_post_id_param: string
          new_moderation_status: Database["public"]["Enums"]["blog_moderation_status_enum"]
        }
        Returns: boolean
      }
      admin_moderate_forum_reply: {
        Args: {
          admin_notes?: string
          new_moderation_status: Database["public"]["Enums"]["forum_moderation_status_enum"]
          reply_id_param: string
        }
        Returns: boolean
      }
      admin_moderate_forum_thread: {
        Args: {
          admin_notes?: string
          new_moderation_status: Database["public"]["Enums"]["forum_moderation_status_enum"]
          thread_id_param: string
        }
        Returns: boolean
      }
      admin_set_user_organisation: {
        Args: { new_organisation_id: string; target_user_id: string }
        Returns: Json
      }
      admin_set_user_role: {
        Args: {
          assigned_by_user_id?: string
          new_role: Database["public"]["Enums"]["user_role_enum"]
          target_user_id: string
        }
        Returns: Json
      }
      change_organisation_status: {
        Args: {
          admin_notes?: string
          new_status: Database["public"]["Enums"]["organisation_status_enum"]
          org_id: string
        }
        Returns: boolean
      }
      check_user_role: {
        Args: { target_role?: Database["public"]["Enums"]["user_role_enum"] }
        Returns: boolean
      }
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
      create_forum_reply: {
        Args: {
          content_param: string
          parent_reply_id_param?: string
          thread_id_param: string
        }
        Returns: Json
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      flag_blog_post: {
        Args: { blog_post_id_param: string; reason?: string }
        Returns: boolean
      }
      generate_anonymous_identifier: {
        Args: { ip_address: unknown; user_agent: string }
        Returns: string
      }
      get_active_organisations_with_counts: {
        Args: {
          countries_filter?: string[]
          limit_param?: number
          name_filter?: string
          offset_param?: number
          regions_filter?: string[]
          size_filter?: string
          sort_by_param?: string
          sort_order_param?: string
          thematic_areas_filter?: string[]
          type_filter?: string
        }
        Returns: {
          address: string
          annual_budget: number
          awards_recognition: string[]
          blog_posts_count: number
          certifications: string[]
          city: string
          contact_email: string
          contact_phone: string
          country: string
          cover_image_url: string
          created_at: string
          created_by: string
          current_page: number
          digital_tools: Json
          establishment_year: number
          featured: boolean
          geographic_coverage: string
          has_digital_tools: boolean
          has_next_page: boolean
          has_prev_page: boolean
          id: string
          languages_spoken: string[]
          legal_status: string
          logo_url: string
          media_platforms: string[]
          media_uploads: Json
          media_work_types: string[]
          mission: string
          name: string
          network_memberships: string[]
          operational_levels: string[]
          other_countries: string[]
          partnerships: string[]
          posts_count: number
          primary_work_methods: string[]
          projects_count: number
          region: string
          registration_number: string
          size: string
          social_links: Json
          staff_count: number
          state_province: string
          status: string
          target_populations: string[]
          tax_exemption_status: boolean
          thematic_focus: string[]
          total_count: number
          total_pages: number
          type: string
          updated_at: string
          verified: boolean
          vision: string
          volunteer_count: number
          website_url: string
        }[]
      }
      get_blog_posts_with_details: {
        Args: {
          language_filter?: string
          page_number?: number
          page_size?: number
          search_query?: string
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          comment_count: number
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string
          id: string
          is_featured: boolean
          language: string
          like_count: number
          moderation_status: string
          organisation_id: string
          organisation_logo_url: string
          organisation_name: string
          published_at: string
          slug: string
          status: string
          tags: Json
          title: string
          total_count: number
          updated_at: string
          view_count: number
        }[]
      }
      get_featured_blog_posts: {
        Args: { limit_count?: number }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          excerpt: string
          featured_image_url: string
          id: string
          language: string
          organisation_id: string
          organisation_logo_url: string
          organisation_name: string
          published_at: string
          slug: string
          tags: string[]
          title: string
        }[]
      }
      get_forum_categories_with_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          color_hex: string
          description_en: string
          description_es: string
          description_fr: string
          icon: string
          id: string
          is_active: boolean
          name_en: string
          name_es: string
          name_fr: string
          organization_count: number
          post_count: number
          sort_order: number
        }[]
      }
      get_forum_reply_children: {
        Args: {
          limit_param?: number
          offset_param?: number
          parent_reply_id_param: string
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          content: string
          created_at: string
          id: string
          is_solution: boolean
          like_count: number
          parent_reply_id: string
          thread_id: string
          updated_at: string
          user_has_liked: boolean
        }[]
      }
      get_forum_thread_replies: {
        Args: {
          limit_param?: number
          offset_param?: number
          thread_id_param: string
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          child_replies_count: number
          content: string
          created_at: string
          id: string
          is_solution: boolean
          like_count: number
          parent_reply_id: string
          thread_id: string
          updated_at: string
          user_has_liked: boolean
        }[]
      }
      get_forum_thread_with_likes: {
        Args: { thread_id_param: string }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          category_color_hex: string
          category_icon: string
          category_id: string
          category_name_en: string
          category_name_es: string
          category_name_fr: string
          content: string
          created_at: string
          id: string
          language: string
          like_count: number
          media: Json
          organisation_id: string
          organisation_logo_url: string
          organisation_name: string
          reply_count: number
          tags: string[]
          title: string
          updated_at: string
          user_has_liked: boolean
          view_count: number
        }[]
      }
      get_forum_threads_with_likes: {
        Args: {
          category_id_param?: string
          limit_param?: number
          offset_param?: number
        }
        Returns: {
          author_avatar_url: string
          author_id: string
          author_name: string
          category_color_hex: string
          category_icon: string
          category_id: string
          category_name_en: string
          category_name_es: string
          category_name_fr: string
          content: string
          created_at: string
          id: string
          language: string
          like_count: number
          media: Json
          organisation_id: string
          organisation_logo_url: string
          organisation_name: string
          reply_count: number
          tags: string[]
          title: string
          updated_at: string
          user_has_liked: boolean
          view_count: number
        }[]
      }
      get_user_organisation_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role_enum"]
      }
      has_user_liked_thread: {
        Args: { thread_id_param: string }
        Returns: boolean
      }
      increment_blog_post_view_count: {
        Args: { blog_post_id_param: string }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_cso_rep: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      like_forum_thread: {
        Args: { thread_id_param: string }
        Returns: Json
      }
      moderate_blog_comment: {
        Args: {
          comment_id_param: string
          moderator_notes?: string
          new_status: Database["public"]["Enums"]["comment_moderation_status_enum"]
        }
        Returns: boolean
      }
      owns_organisation: {
        Args: { org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      blog_moderation_status_enum: "approved" | "flagged" | "rejected"
      comment_moderation_status_enum: "approved" | "flagged" | "hidden"
      country_enum: "Nigeria" | "Benin" | "Gambia"
      export_status_enum: "pending" | "processing" | "completed" | "failed"
      file_type_enum: "image" | "pdf" | "video" | "audio" | "document" | "other"
      forum_moderation_status_enum: "approved" | "flagged" | "rejected"
      funding_source_type_enum:
        | "government"
        | "foundation"
        | "ngo"
        | "international_organization"
        | "private_corporation"
        | "multilateral_agency"
        | "bilateral_agency"
        | "university"
        | "research_institute"
        | "other"
      geographic_focus_enum:
        | "global"
        | "africa"
        | "west_africa"
        | "east_africa"
        | "southern_africa"
        | "central_africa"
        | "north_africa"
        | "nigeria"
        | "benin"
        | "gambia"
        | "regional"
        | "national"
        | "local"
        | "other"
      language_enum: "English" | "French"
      milestone_status_enum:
        | "planned"
        | "in_progress"
        | "achieved"
        | "delayed"
        | "cancelled"
      opportunity_status_enum:
        | "open"
        | "closing_soon"
        | "closed"
        | "postponed"
        | "cancelled"
      opportunity_type_enum:
        | "grant"
        | "fellowship"
        | "donor_call"
        | "scholarship"
        | "award"
        | "loan"
        | "other"
      organisation_affiliation_status_enum:
        | "pending"
        | "approved"
        | "rejected"
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
  public: {
    Enums: {
      blog_moderation_status_enum: ["approved", "flagged", "rejected"],
      comment_moderation_status_enum: ["approved", "flagged", "hidden"],
      country_enum: ["Nigeria", "Benin", "Gambia"],
      export_status_enum: ["pending", "processing", "completed", "failed"],
      file_type_enum: ["image", "pdf", "video", "audio", "document", "other"],
      forum_moderation_status_enum: ["approved", "flagged", "rejected"],
      funding_source_type_enum: [
        "government",
        "foundation",
        "ngo",
        "international_organization",
        "private_corporation",
        "multilateral_agency",
        "bilateral_agency",
        "university",
        "research_institute",
        "other",
      ],
      geographic_focus_enum: [
        "global",
        "africa",
        "west_africa",
        "east_africa",
        "southern_africa",
        "central_africa",
        "north_africa",
        "nigeria",
        "benin",
        "gambia",
        "regional",
        "national",
        "local",
        "other",
      ],
      language_enum: ["English", "French"],
      milestone_status_enum: [
        "planned",
        "in_progress",
        "achieved",
        "delayed",
        "cancelled",
      ],
      opportunity_status_enum: [
        "open",
        "closing_soon",
        "closed",
        "postponed",
        "cancelled",
      ],
      opportunity_type_enum: [
        "grant",
        "fellowship",
        "donor_call",
        "scholarship",
        "award",
        "loan",
        "other",
      ],
      organisation_affiliation_status_enum: [
        "pending",
        "approved",
        "rejected",
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
