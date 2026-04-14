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
    }
  )
)
