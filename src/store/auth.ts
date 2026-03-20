'use client'
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { UserRow, UserRole } from '@/types/database'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserRow | null
  loading: boolean
  initialized: boolean

  // Actions
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<{ error: string | null }>
  register: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  fetchProfile: (userId: string) => Promise<UserRow | null>
  updateProfile: (data: Partial<UserRow>) => Promise<{ error: string | null }>
}

export const useAuth = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,

  async initialize() {
    if (get().initialized) return

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await get().fetchProfile(session.user.id)
        set({ user: session.user, session, profile, loading: false, initialized: true })
      } else {
        set({ user: null, session: null, profile: null, loading: false, initialized: true })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await get().fetchProfile(session.user.id)
          set({ user: session.user, session, profile, loading: false })
        } else {
          set({ user: null, session: null, profile: null, loading: false })
        }
      })
    } catch {
      set({ loading: false, initialized: true })
    }
  },

  async login(email, password) {
    set({ loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      set({ loading: false })
      return { error: error.message }
    }

    if (data.user) {
      const profile = await get().fetchProfile(data.user.id)
      set({ user: data.user, session: data.session, profile, loading: false })
    }

    return { error: null }
  },

  async register(email, password, fullName, role = 'customer') {
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    })

    if (error) {
      set({ loading: false })
      return { error: error.message }
    }

    if (data.user) {
      // Profile will be created by the trigger
      // Wait a moment then fetch
      await new Promise(r => setTimeout(r, 500))
      const profile = await get().fetchProfile(data.user.id)
      set({ user: data.user, session: data.session, profile, loading: false })
    }

    return { error: null }
  },

  async logout() {
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null })
  },

  async fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) return null
      return data as UserRow
    } catch {
      return null
    }
  },

  async updateProfile(updates) {
    const user = get().user
    if (!user) return { error: 'Chua dang nhap' }

    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (error) return { error: error.message }

    const profile = await get().fetchProfile(user.id)
    set({ profile })
    return { error: null }
  },
}))
