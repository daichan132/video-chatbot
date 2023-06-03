export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      chats: {
        Row: {
          advanced_settings: Json | null;
          created_at: string | null;
          id: string;
          model: string | null;
          owner: string | null;
          system_prompt: string | null;
          title: string | null;
        };
        Insert: {
          advanced_settings?: Json | null;
          created_at?: string | null;
          id?: string;
          model?: string | null;
          owner?: string | null;
          system_prompt?: string | null;
          title?: string | null;
        };
        Update: {
          advanced_settings?: Json | null;
          created_at?: string | null;
          id?: string;
          model?: string | null;
          owner?: string | null;
          system_prompt?: string | null;
          title?: string | null;
        };
      };
      messages: {
        Row: {
          chat: string | null;
          content: string | null;
          created_at: string | null;
          id: string;
          owner: string | null;
          role: string | null;
        };
        Insert: {
          chat?: string | null;
          content?: string | null;
          created_at?: string | null;
          id?: string;
          owner?: string | null;
          role?: string | null;
        };
        Update: {
          chat?: string | null;
          content?: string | null;
          created_at?: string | null;
          id?: string;
          owner?: string | null;
          role?: string | null;
        };
      };
      nods_page: {
        Row: {
          chat: string | null;
          checksum: string | null;
          id: number;
          meta: Json | null;
          owner: string | null;
          parent_page_id: number | null;
          source: string | null;
          type: string | null;
          video_url: string | null;
        };
        Insert: {
          chat?: string | null;
          checksum?: string | null;
          id?: number;
          meta?: Json | null;
          owner?: string | null;
          parent_page_id?: number | null;
          source?: string | null;
          type?: string | null;
          video_url?: string | null;
        };
        Update: {
          chat?: string | null;
          checksum?: string | null;
          id?: number;
          meta?: Json | null;
          owner?: string | null;
          parent_page_id?: number | null;
          source?: string | null;
          type?: string | null;
          video_url?: string | null;
        };
      };
      nods_page_section: {
        Row: {
          content: string | null;
          embedding: string | null;
          heading: string | null;
          id: number;
          owner: string | null;
          page_id: number;
          slug: string | null;
          token_count: number | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          heading?: string | null;
          id?: number;
          owner?: string | null;
          page_id: number;
          slug?: string | null;
          token_count?: number | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          heading?: string | null;
          id?: number;
          owner?: string | null;
          page_id?: number;
          slug?: string | null;
          token_count?: number | null;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_page_parents: {
        Args: {
          page_id: number;
        };
        Returns: {
          id: number;
          parent_page_id: number;
          path: string;
          meta: Json;
        }[];
      };
      ivfflathandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      match_page_sections: {
        Args: {
          embedding: string;
          match_threshold: number;
          match_count: number;
          min_content_length: number;
          page_id_in: number;
        };
        Returns: {
          id: number;
          page_id: number;
          slug: string;
          heading: string;
          content: string;
          similarity: number;
        }[];
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_norm: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          '': string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
