import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/admin/types'

// ─── Mock credentials ─────────────────────────────────────────────────────────
const MOCK_CREDENTIALS = {
  username: 'amerrawahneh',
  password: 'Rawahneh97',
  role: 'admin' as UserRole,
  name: 'Amer Rawahneh',
}

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

        // Simulate network latency — replace this block with a real API call later:
        //   const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
        //   if (!res.ok) throw new Error('Invalid credentials')
        //   const { token, user } = await res.json()
        await new Promise((r) => setTimeout(r, 600))

        if (
          username.trim() === MOCK_CREDENTIALS.username &&
          password === MOCK_CREDENTIALS.password
        ) {
          const mockToken = `mock-jwt-${Date.now()}`
          set({
            isAuthenticated: true,
            user: {
              username: MOCK_CREDENTIALS.username,
              name: MOCK_CREDENTIALS.name,
              role: MOCK_CREDENTIALS.role,
            },
            token: mockToken,
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
      name: 'nwc-admin-auth',
      // Only persist auth state, not loading/error
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)
