import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-project-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Database helpers
export const db = {
  // Users
  createUserProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: userId, ...profileData }])
    return { data, error }
  },

  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Courses
  getCourses: async () => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_chapters (
          id,
          title,
          order_index
        )
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getCourse: async (id: string) => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_chapters (
          id,
          title,
          content_url,
          content_type,
          order_index,
          duration_minutes
        )
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  createCourse: async (courseData: any) => {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
    return { data, error }
  },

  // Progress tracking
  getUserProgress: async (userId: string, courseId?: string) => {
    let query = supabase
      .from('user_progress')
      .select(`
        *,
        courses (title, module),
        course_chapters (title)
      `)
      .eq('user_id', userId)
    
    if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  updateProgress: async (userId: string, courseId: string, chapterId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert([{
        user_id: userId,
        course_id: courseId,
        chapter_id: chapterId,
        completed_at: new Date().toISOString()
      }])
    return { data, error }
  },

  // Badges
  getUserBadges: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (name, description, icon, color)
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  awardBadge: async (userId: string, courseId: string) => {
    // Check if course is completed
    const { data: progress } = await supabase
      .from('user_progress')
      .select('chapter_id')
      .eq('user_id', userId)
      .eq('course_id', courseId)

    const { data: totalChapters } = await supabase
      .from('course_chapters')
      .select('id')
      .eq('course_id', courseId)

    if (progress && totalChapters && progress.length === totalChapters.length) {
      // Award badge
      const { data, error } = await supabase
        .from('user_badges')
        .insert([{
          user_id: userId,
          course_id: courseId,
          earned_at: new Date().toISOString()
        }])
      return { data, error }
    }
    
    return { data: null, error: null }
  }
}