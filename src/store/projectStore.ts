import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']
type Document = Database['public']['Tables']['documents']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

interface ProjectState {
  currentProject: Project | null
  projects: Project[]
  documents: Document[]
  tasks: Task[]
  loading: boolean
  
  // Actions
  setCurrentProject: (project: Project) => void
  fetchProjects: () => Promise<void>
  fetchProjectDocuments: (projectId: string) => Promise<void>
  fetchProjectTasks: (projectId: string) => Promise<void>
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>
  uploadDocument: (file: File, projectId: string) => Promise<Document>
  initializeUserData: () => Promise<void>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  projects: [],
  documents: [],
  tasks: [],
  loading: false,

  setCurrentProject: (project: Project) => {
    set({ currentProject: project })
  },

  initializeUserData: async () => {
    try {
      // Call the function to add user to sample projects
      const { error } = await supabase.rpc('add_user_to_sample_projects')
      if (error) {
        console.error('Error initializing user data:', error)
      }
    } catch (error) {
      console.error('Error calling initialization function:', error)
    }
  },

  fetchProjects: async () => {
    set({ loading: true })
    try {
      // First, try to initialize user data
      await get().initializeUserData()
      
      // Then fetch projects
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      set({ projects: data || [] })
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Set empty array on error to prevent infinite loading
      set({ projects: [] })
    } finally {
      set({ loading: false })
    }
  },

  fetchProjectDocuments: async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ documents: data || [] })
    } catch (error) {
      console.error('Error fetching documents:', error)
      set({ documents: [] })
    }
  },

  fetchProjectTasks: async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ tasks: data || [] })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      set({ tasks: [] })
    }
  },

  createProject: async (projectData) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (error) throw error
      
      // Add the user as project owner
      await supabase
        .from('project_members')
        .insert({
          project_id: data.id,
          user_id: projectData.owner_id,
          role: 'owner'
        })
      
      const { projects } = get()
      set({ projects: [data, ...projects] })
      
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  },

  uploadDocument: async (file: File, projectId: string) => {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${projectId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          project_id: projectId,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          metadata: {}
        })
        .select()
        .single()

      if (error) throw error

      const { documents } = get()
      set({ documents: [data, ...documents] })

      return data
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  },
}))