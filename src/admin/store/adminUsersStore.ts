import { create } from 'zustand'
import type { AdminUser } from '@/admin/types'
import { mockAdminUsers } from '@/admin/data/mockUsers'

const API = '/api'

interface AdminUsersStore {
  users: AdminUser[]
  loaded: boolean
  init: () => Promise<void>
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => Promise<AdminUser>
  updateUser: (id: string, updates: Partial<AdminUser>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  toggleStatus: (id: string) => Promise<void>
}

export const useAdminUsersStore = create<AdminUsersStore>()((set, get) => ({
  // Start with mock data so dropdowns render immediately on first load
  users: [...mockAdminUsers],
  loaded: false,

  init: async () => {
    if (get().loaded) return
    try {
      const res = await fetch(`${API}/users`)
      if (!res.ok) return
      const users: AdminUser[] = await res.json()
      set({ users, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  addUser: async (data) => {
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const newUser: AdminUser = await res.json()
    set((s) => ({ users: [...s.users, newUser] }))
    return newUser
  },

  updateUser: async (id, updates) => {
    await fetch(`${API}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }))
  },

  deleteUser: async (id) => {
    await fetch(`${API}/users/${id}`, { method: 'DELETE' })
    set((s) => ({ users: s.users.filter((u) => u.id !== id) }))
  },

  toggleStatus: async (id) => {
    const user = get().users.find((u) => u.id === id)
    if (!user) return
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    await fetch(`${API}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id ? { ...u, status: newStatus } : u
      ),
    }))
  },
}))
