import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/admin/types'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'

interface AppUser {
  id: string
  username: string
  name: string
  role: UserRole
}

interface UserAuthStore {
  isAuthenticated: boolean
  user: AppUser | null
  token: string | null
  error: string | null
  isLoading: boolean

  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

export const useUserAuthStore = create<UserAuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
      isLoading: false,

      login: async (username, password) => {
        set({ isLoading: true, error: null })

        // Simulate network latency
        await new Promise((r) => setTimeout(r, 500))

        // Validate against the adminUsersStore (single source of truth for users)
        const { users } = useAdminUsersStore.getState()
        const match = users.find(
          (u) =>
            u.username.toLowerCase() === username.trim().toLowerCase() &&
            u.password === password &&
            u.status === 'active'
        )

        if (match) {
          set({
            isAuthenticated: true,
            user: {
              id: match.id,
              username: match.username,
              name: match.name,
              role: match.role,
            },
            token: `mock-app-jwt-${Date.now()}`,
            isLoading: false,
            error: null,
          })
          return true
        }

        set({
          isLoading: false,
          error: 'Invalid username or password. Please try again.',
        })
        return false
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'nwc-user-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)
