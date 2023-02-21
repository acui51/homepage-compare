export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      "homepage-news": {
        Row: {
          created_at: string | null;
          description: string | null;
          embeddings: number[] | null;
          height: string | null;
          id: number;
          source_id: string | null;
          title: string | null;
          width: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          embeddings?: number[] | null;
          height?: string | null;
          id?: number;
          source_id?: string | null;
          title?: string | null;
          width?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          embeddings?: number[] | null;
          height?: string | null;
          id?: number;
          source_id?: string | null;
          title?: string | null;
          width?: string | null;
        };
      };
      "top-headlines-news": {
        Row: {
          author: string | null;
          content: string | null;
          description: string | null;
          id: number;
          publishedAt: string | null;
          source_id: string | null;
          source_name: string | null;
          title: string | null;
          url: string | null;
          urlToImage: string | null;
        };
        Insert: {
          author?: string | null;
          content?: string | null;
          description?: string | null;
          id?: number;
          publishedAt?: string | null;
          source_id?: string | null;
          source_name?: string | null;
          title?: string | null;
          url?: string | null;
          urlToImage?: string | null;
        };
        Update: {
          author?: string | null;
          content?: string | null;
          description?: string | null;
          id?: number;
          publishedAt?: string | null;
          source_id?: string | null;
          source_name?: string | null;
          title?: string | null;
          url?: string | null;
          urlToImage?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
