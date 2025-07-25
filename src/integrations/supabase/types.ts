export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          images: string[]
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          images?: string[]
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          images?: string[]
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      activities: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          photo_description: string | null
          photo_id: string | null
          section_id: string | null
          sort_order: number | null
          subtitle: string | null
          tag_id: string | null
          title: string
          updated_at: string
          video_description: string | null
          video_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          photo_description?: string | null
          photo_id?: string | null
          section_id?: string | null
          sort_order?: number | null
          subtitle?: string | null
          tag_id?: string | null
          title: string
          updated_at?: string
          video_description?: string | null
          video_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          photo_description?: string | null
          photo_id?: string | null
          section_id?: string | null
          sort_order?: number | null
          subtitle?: string | null
          tag_id?: string | null
          title?: string
          updated_at?: string
          video_description?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      photos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image_url: string
          images: string[] | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url: string
          images?: string[] | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string
          images?: string[] | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          duration: number | null
          excerpt: string | null
          featured: boolean | null
          file_size: number | null
          id: string
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          video_type: string | null
          youtube_id: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          excerpt?: string | null
          featured?: boolean | null
          file_size?: number | null
          id?: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          video_type?: string | null
          youtube_id?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          excerpt?: string | null
          featured?: boolean | null
          file_size?: number | null
          id?: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          video_type?: string | null
          youtube_id?: string | null
        }
        Relationships: []
      }
      hero: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
          subtitle: string | null
          tag_ids: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
          subtitle?: string | null
          tag_ids?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
          subtitle?: string | null
          tag_ids?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      impact: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          number: number
          sort_order: number | null
          subtitle: string | null
          tags_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          number: number
          sort_order?: number | null
          subtitle?: string | null
          tags_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          number?: number
          sort_order?: number | null
          subtitle?: string | null
          tags_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "impact_tags_id_fkey"
            columns: ["tags_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      schools: {
        Row: {
          address: string | null
          capacity: number | null
          created_at: string
          description: string | null
          director: string | null
          email: string | null
          facilities: string[] | null
          featured: boolean | null
          id: string
          image_url: string | null
          images: string[] | null
          name: string
          phone: string | null
          programs: string[] | null
          status: string | null
          type: string
          updated_at: string
          tagname: string | null
          hero_id: string | null
          subtitle: string | null
          coordonne_id: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          director?: string | null
          email?: string | null
          facilities?: string[] | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          name: string
          phone?: string | null
          programs?: string[] | null
          status?: string | null
          type: string
          updated_at?: string
          tagname?: string | null
          hero_id?: string | null
          subtitle?: string | null
          coordonne_id?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          director?: string | null
          email?: string | null
          facilities?: string[] | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          name?: string
          phone?: string | null
          programs?: string[] | null
          status?: string | null
          type?: string
          updated_at?: string
          tagname?: string | null
          hero_id?: string | null
          subtitle?: string | null
          coordonne_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_hero_id_fkey"
            columns: ["hero_id"]
            isOneToOne: false
            referencedRelation: "hero"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_coordonne_id_fkey"
            columns: ["coordonne_id"]
            isOneToOne: false
            referencedRelation: "coordonnes"
            referencedColumns: ["id"]
          }
        ]
      }
      sections: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          hero_id: string | null
          id: string
          image_url: string
          sort_order: number | null
          subtitle: string | null
          tag_name: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          hero_id?: string | null
          id?: string
          image_url: string
          sort_order?: number | null
          subtitle?: string | null
          tag_name?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          hero_id?: string | null
          id?: string
          image_url?: string
          sort_order?: number | null
          subtitle?: string | null
          tag_name?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_hero_id_fkey"
            columns: ["hero_id"]
            isOneToOne: false
            referencedRelation: "hero"
            referencedColumns: ["id"]
          }
        ]
      },
      directors: {
        Row: {
          active: boolean | null
          centre_id: string | null
          created_at: string
          id: string
          image_url: string | null
          is_director: boolean | null
          job: string | null
          name: string
          responsibility: string | null
          sort_order: number | null
          updated_at: string
          school_id: string | null
        }
        Insert: {
          active?: boolean | null
          centre_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_director?: boolean | null
          job?: string | null
          name: string
          responsibility?: string | null
          sort_order?: number | null
          updated_at?: string
          school_id?: string | null
        }
        Update: {
          active?: boolean | null
          centre_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_director?: boolean | null
          job?: string | null
          name?: string
          responsibility?: string | null
          sort_order?: number | null
          updated_at?: string
          school_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directors_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directors_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          }
        ]
      },
      centres: {
        Row: {
          active: boolean | null
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          hero_id: string | null
          id: string
          name: string
          phone: string | null
          sort_order: number | null
          updated_at: string
          video_id: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          hero_id?: string | null
          id?: string
          name: string
          phone?: string | null
          sort_order?: number | null
          updated_at?: string
          video_id?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          hero_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          sort_order?: number | null
          updated_at?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "centres_hero_id_fkey"
            columns: ["hero_id"]
            isOneToOne: false
            referencedRelation: "hero"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "centres_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      },
      coordonnes: {
        Row: {
          active: boolean | null
          address: string | null
          created_at: string
          email: string | null
          google_map_url: string | null
          id: string
          phone: string | null
          sort_order: number | null
          tags_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          created_at?: string
          email?: string | null
          google_map_url?: string | null
          id?: string
          phone?: string | null
          sort_order?: number | null
          tags_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          created_at?: string
          email?: string | null
          google_map_url?: string | null
          id?: string
          phone?: string | null
          sort_order?: number | null
          tags_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordonnes_tags_id_fkey"
            columns: ["tags_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
