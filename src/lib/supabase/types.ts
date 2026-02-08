export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      gmail_attachments: {
        Row: {
          content_type: string;
          created_at: string;
          email_id: string;
          filename: string;
          id: string;
          size_bytes: number;
          storage_path: string;
        };
        Insert: {
          content_type: string;
          created_at?: string;
          email_id: string;
          filename: string;
          id?: string;
          size_bytes: number;
          storage_path: string;
        };
        Update: {
          content_type?: string;
          created_at?: string;
          email_id?: string;
          filename?: string;
          id?: string;
          size_bytes?: number;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_attachments_email_id_fkey";
            columns: ["email_id"];
            isOneToOne: false;
            referencedRelation: "gmail_emails";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_contacts: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          id: string;
          is_self: boolean;
          name: string;
          session_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          is_self?: boolean;
          name: string;
          session_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          is_self?: boolean;
          name?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_contacts_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_email_labels: {
        Row: {
          email_id: string;
          label_id: string;
        };
        Insert: {
          email_id: string;
          label_id: string;
        };
        Update: {
          email_id?: string;
          label_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_email_labels_email_id_fkey";
            columns: ["email_id"];
            isOneToOne: false;
            referencedRelation: "gmail_emails";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gmail_email_labels_label_id_fkey";
            columns: ["label_id"];
            isOneToOne: false;
            referencedRelation: "gmail_labels";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_email_recipients: {
        Row: {
          contact_id: string;
          email_id: string;
          id: string;
          type: string;
        };
        Insert: {
          contact_id: string;
          email_id: string;
          id?: string;
          type: string;
        };
        Update: {
          contact_id?: string;
          email_id?: string;
          id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_email_recipients_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "gmail_contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gmail_email_recipients_email_id_fkey";
            columns: ["email_id"];
            isOneToOne: false;
            referencedRelation: "gmail_emails";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_emails: {
        Row: {
          body_html: string;
          body_text: string;
          category: string;
          created_at: string;
          from_contact_id: string;
          fts: unknown;
          id: string;
          is_archived: boolean;
          is_draft: boolean;
          is_important: boolean;
          is_read: boolean;
          is_spam: boolean;
          is_starred: boolean;
          is_trash: boolean;
          sent_at: string;
          session_id: string;
          snippet: string;
          snooze_until: string | null;
          subject: string;
          thread_id: string;
        };
        Insert: {
          body_html?: string;
          body_text?: string;
          category?: string;
          created_at?: string;
          from_contact_id: string;
          id?: string;
          is_archived?: boolean;
          is_draft?: boolean;
          is_important?: boolean;
          is_read?: boolean;
          is_spam?: boolean;
          is_starred?: boolean;
          is_trash?: boolean;
          sent_at?: string;
          session_id: string;
          snippet?: string;
          snooze_until?: string | null;
          subject: string;
          thread_id: string;
        };
        Update: {
          body_html?: string;
          body_text?: string;
          category?: string;
          created_at?: string;
          from_contact_id?: string;
          id?: string;
          is_archived?: boolean;
          is_draft?: boolean;
          is_important?: boolean;
          is_read?: boolean;
          is_spam?: boolean;
          is_starred?: boolean;
          is_trash?: boolean;
          sent_at?: string;
          session_id?: string;
          snippet?: string;
          snooze_until?: string | null;
          subject?: string;
          thread_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_emails_from_contact_id_fkey";
            columns: ["from_contact_id"];
            isOneToOne: false;
            referencedRelation: "gmail_contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gmail_emails_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gmail_emails_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "gmail_threads";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_filters: {
        Row: {
          actions: Json;
          created_at: string;
          criteria: Json;
          id: string;
          is_enabled: boolean;
          session_id: string;
        };
        Insert: {
          actions?: Json;
          created_at?: string;
          criteria?: Json;
          id?: string;
          is_enabled?: boolean;
          session_id: string;
        };
        Update: {
          actions?: Json;
          created_at?: string;
          criteria?: Json;
          id?: string;
          is_enabled?: boolean;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_filters_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_labels: {
        Row: {
          color: string | null;
          created_at: string;
          id: string;
          name: string;
          parent_id: string | null;
          position: number;
          session_id: string;
          show_in_list: boolean;
          show_in_message: boolean;
          type: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          parent_id?: string | null;
          position?: number;
          session_id: string;
          show_in_list?: boolean;
          show_in_message?: boolean;
          type?: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          parent_id?: string | null;
          position?: number;
          session_id?: string;
          show_in_list?: boolean;
          show_in_message?: boolean;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_labels_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "gmail_labels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gmail_labels_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_sessions: {
        Row: {
          accent_color: string;
          conversation_view: boolean;
          created_at: string;
          display_density: string;
          expires_at: string;
          hover_actions: boolean;
          id: string;
          inbox_type: string;
          is_seeded: boolean;
          keyboard_shortcuts: boolean;
          last_active_at: string;
          page_size: number;
          theme_mode: string;
          undo_send_sec: number;
        };
        Insert: {
          accent_color?: string;
          conversation_view?: boolean;
          created_at?: string;
          display_density?: string;
          expires_at?: string;
          hover_actions?: boolean;
          id?: string;
          inbox_type?: string;
          is_seeded?: boolean;
          keyboard_shortcuts?: boolean;
          last_active_at?: string;
          page_size?: number;
          theme_mode?: string;
          undo_send_sec?: number;
        };
        Update: {
          accent_color?: string;
          conversation_view?: boolean;
          created_at?: string;
          display_density?: string;
          expires_at?: string;
          hover_actions?: boolean;
          id?: string;
          inbox_type?: string;
          is_seeded?: boolean;
          keyboard_shortcuts?: boolean;
          last_active_at?: string;
          page_size?: number;
          theme_mode?: string;
          undo_send_sec?: number;
        };
        Relationships: [];
      };
      gmail_signatures: {
        Row: {
          body_html: string;
          created_at: string;
          id: string;
          is_default: boolean;
          name: string;
          session_id: string;
        };
        Insert: {
          body_html?: string;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          name: string;
          session_id: string;
        };
        Update: {
          body_html?: string;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          name?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_signatures_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_snooze_queue: {
        Row: {
          created_at: string;
          email_id: string;
          id: string;
          session_id: string;
          snooze_until: string;
        };
        Insert: {
          created_at?: string;
          email_id: string;
          id?: string;
          session_id: string;
          snooze_until: string;
        };
        Update: {
          created_at?: string;
          email_id?: string;
          id?: string;
          session_id?: string;
          snooze_until?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_snooze_queue_email_id_fkey";
            columns: ["email_id"];
            isOneToOne: false;
            referencedRelation: "gmail_emails";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gmail_snooze_queue_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_threads: {
        Row: {
          created_at: string;
          id: string;
          is_muted: boolean;
          last_message_at: string;
          message_count: number;
          session_id: string;
          subject: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_muted?: boolean;
          last_message_at?: string;
          message_count?: number;
          session_id: string;
          subject: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_muted?: boolean;
          last_message_at?: string;
          message_count?: number;
          session_id?: string;
          subject?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_threads_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "gmail_sessions";
            referencedColumns: ["id"];
          },
        ];
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
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
