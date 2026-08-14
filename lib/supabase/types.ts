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
      sources: {
        Row: {
          id: string
          name: string
          listing_url: string
          parser_strategy: string | null
          active: boolean
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          listing_url: string
          parser_strategy?: string | null
          active?: boolean
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          listing_url?: string
          parser_strategy?: string | null
          active?: boolean
          logo_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          id: string
          source_id: string
          original_url: string
          canonical_url: string
          title: string
          image_url: string
          published_at: string
          raw_text: string
          scraped_at: string
          analyzed_at: string | null
        }
        Insert: {
          id?: string
          source_id: string
          original_url: string
          canonical_url: string
          title: string
          image_url: string
          published_at: string
          raw_text: string
          scraped_at?: string
          analyzed_at?: string | null
        }
        Update: {
          id?: string
          source_id?: string
          original_url?: string
          canonical_url?: string
          title?: string
          image_url?: string
          published_at?: string
          raw_text?: string
          scraped_at?: string
          analyzed_at?: string | null
        }
        Relationships: []
      }
      article_analyses: {
        Row: {
          id: string
          article_id: string
          summary: string
          sentiment_score: number
          sentiment_label: 'positive' | 'neutral' | 'negative'
          bias_score: number
          bias_label: 'left' | 'center' | 'right' | 'mixed' | 'unclear'
          left_percentage: number
          center_percentage: number
          right_percentage: number
          confidence: number
          framing_notes: string | null
          loaded_terms: string[] | null
          disclaimer: string
          model: string
          embedding: number[] | null
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          summary: string
          sentiment_score: number
          sentiment_label: 'positive' | 'neutral' | 'negative'
          bias_score: number
          bias_label: 'left' | 'center' | 'right' | 'mixed' | 'unclear'
          left_percentage: number
          center_percentage: number
          right_percentage: number
          confidence: number
          framing_notes?: string | null
          loaded_terms?: string[] | null
          disclaimer: string
          model: string
          embedding?: number[] | null
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          summary?: string
          sentiment_score?: number
          sentiment_label?: 'positive' | 'neutral' | 'negative'
          bias_score?: number
          bias_label?: 'left' | 'center' | 'right' | 'mixed' | 'unclear'
          left_percentage?: number
          center_percentage?: number
          right_percentage?: number
          confidence?: number
          framing_notes?: string | null
          loaded_terms?: string[] | null
          disclaimer?: string
          model?: string
          embedding?: number[] | null
          created_at?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          id: string
          type: string
          status: string
          message: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          status: string
          message?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          status?: string
          message?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      oxylabs_schedules: {
        Row: {
          id: string
          source_id: string
          oxylabs_schedule_id: string
          created_at: string
        }
        Insert: {
          id?: string
          source_id: string
          oxylabs_schedule_id: string
          created_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          oxylabs_schedule_id?: string
          created_at?: string
        }
        Relationships: []
      }
      oxylabs_schedule_runs: {
        Row: {
          id: string
          oxylabs_schedule_id: string
          oxylabs_run_id: string
          status: string
          started_at: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          oxylabs_schedule_id: string
          oxylabs_run_id: string
          status: string
          started_at?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          oxylabs_schedule_id?: string
          oxylabs_run_id?: string
          status?: string
          started_at?: string | null
          processed_at?: string | null
          created_at?: string
        }
        Relationships: []
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
