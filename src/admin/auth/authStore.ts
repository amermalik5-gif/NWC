import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/admin/types'

interface AuthStore {
  isAuthenticated: boolean
  user: { username: string; name: string; role: UserRole } | null
  token: string | null
  error: string | null
  isLoading: boolean

  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
      isLoading: false,

      login: async (username, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await fetch('/api/auth/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim(), password }),
          })
          if (!res.ok) throw new Error('Invalid credentials')
          const { token, user } = await res.json()
          set({ isAuthenticated: true, user, token, isLoading: false, error: null })
          return true
        } catch {
          set({ isLoading: false, error: 'Invalid username or password. Please try again.' })
          return false
        }
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, token: null, error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'nwc-admin-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)
