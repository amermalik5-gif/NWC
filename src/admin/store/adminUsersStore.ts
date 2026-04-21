import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/admin/types'
import { mockAdminUsers } from '@/admin/data/mockUsers'

interface AdminUsersStore {
  users: AdminUser[]
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => AdminUser
  updateUser: (id: string, updates: Partial<AdminUser>) => void
  deleteUser: (id: string) => void
  toggleStatus: (id: string) => void
}

export const useAdminUsersStore = create<AdminUsersStore>()(
  persist(
    (set, get) => ({
      users: [...mockAdminUsers],

      addUser: (data) => {
        // Derive next ID from the highest existing USR number
        const maxId = get().users.reduce((acc, u) => {
          const n = parseInt(u.id.replace('USR-', ''), 10)
          return isNaN(n) ? acc : Math.max(acc, n)
        }, 0)
        const newUser: AdminUser = {
          ...data,
          id: `USR-${String(maxId + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        }
        set((s) => ({ users: [...s.users, newUser] }))
        return newUser
      },

      updateUser: (id, updates) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        }))
      },

      deleteUser: (id) => {
        set((s) => ({ users: s.users.filter((u) => u.id !== id) }))
      },

      toggleStatus: (id) => {
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
          ),
        }))
      },
    }),
    {
      name: 'nwc-admin-users',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { users: AdminUser[] }
        // v0→v1 or v1→v2: merge passwords from mockAdminUsers for any user missing one
        if (version < 2) {
          state.users = state.users.map((u) => {
            if (!u.password) {
              const mock = mockAdminUsers.find((m) => m.id === u.id)
              return { ...u, password: mock?.password }
            }
            return u
          })
        }
        return state
      },
    }
  )
)
