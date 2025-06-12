import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'project_manager' | 'contractor' | 'client' | 'team_member'
          avatar_url: string | null
          phone: string | null
          company: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'project_manager' | 'contractor' | 'client' | 'team_member'
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'project_manager' | 'contractor' | 'client' | 'team_member'
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          start_date: string | null
          end_date: string | null
          budget: number | null
          owner_id: string | null
          address: string | null
          client_name: string | null
          client_email: string | null
          client_phone: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          owner_id?: string | null
          address?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          owner_id?: string | null
          address?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          permissions: any
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          permissions?: any
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          permissions?: any
          joined_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          version: number
          parent_id: string | null
          uploaded_by: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          version?: number
          parent_id?: string | null
          uploaded_by?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          version?: number
          parent_id?: string | null
          uploaded_by?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string | null
          created_by: string | null
          due_date: string | null
          start_date: string | null
          end_date: string | null
          dependencies: string[]
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          created_by?: string | null
          due_date?: string | null
          start_date?: string | null
          end_date?: string | null
          dependencies?: string[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          created_by?: string | null
          due_date?: string | null
          start_date?: string | null
          end_date?: string | null
          dependencies?: string[]
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string | null
          context: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          title?: string | null
          context?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          title?: string | null
          context?: any
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          metadata?: any
          created_at?: string
        }
      }
    }
    Functions: {
      add_user_to_sample_projects: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
  }
}