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
          role: 'project_manager' | 'foreman' | 'subcontractor' | 'client'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'project_manager' | 'foreman' | 'subcontractor' | 'client'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'project_manager' | 'foreman' | 'subcontractor' | 'client'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'planning' | 'active' | 'on_hold' | 'completed'
          start_date: string | null
          end_date: string | null
          budget: number | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'planning' | 'active' | 'on_hold' | 'completed'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          owner_id?: string
          created_at?: string
          updated_at?: string
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
          uploaded_by: string
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
          uploaded_by: string
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
          uploaded_by?: string
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
          status: 'todo' | 'in_progress' | 'review' | 'completed'
          priority: 'low' | 'medium' | 'high' | 'critical'
          assigned_to: string | null
          created_by: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'review' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}