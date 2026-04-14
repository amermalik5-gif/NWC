import { create } from 'zustand'
import type { AdminUser } from '@/admin/types'
import { mockAdminUsers } from '@/admin/data/mockUsers'

interface AdminUsersStore {
  users: AdminUser[]
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => AdminUser
  updateUser: (id: string, updates: Partial<AdminUser>) => void
  deleteUser: (id: string) => void
  toggleStatus: (id: string) => void
}

let nextId = mockAdminUsers.length + 1

export const useAdminUsersStore = create<AdminUsersStore>((set, get) => ({
  users: [...mockAdminUsers],

  addUser: (data) => {
    const newUser: AdminUser = {
      ...data,
      id: `USR-${String(nextId++).padStart(3, '0')}`,
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
    const user = get().users.find((u) => u.id === id)
    if (!user) return
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    }))
  },
}))
