import { create } from 'zustand'
import type { ConfigItem, ConfigCategory } from '@/admin/types'
import { mockSources, mockServices, mockStatuses, mockPriorities } from '@/admin/data/mockConfig'

const API = '/api'

interface AdminConfigStore {
  sources: ConfigItem[]
  services: ConfigItem[]
  statuses: ConfigItem[]
  priorities: ConfigItem[]
  loaded: boolean

  init: () => Promise<void>
  addItem: (category: ConfigCategory, item: Omit<ConfigItem, 'id' | 'isSystem'>) => ConfigItem
  updateItem: (category: ConfigCategory, id: string, updates: Partial<ConfigItem>) => void
  deleteItem: (category: ConfigCategory, id: string) => void
  toggleActive: (category: ConfigCategory, id: string) => void
  reorder: (category: ConfigCategory, items: ConfigItem[]) => void
}

const categoryKey: Record<ConfigCategory, keyof AdminConfigStore> = {
  source: 'sources',
  service: 'services',
  status: 'statuses',
  priority: 'priorities',
}

async function syncConfig(state: AdminConfigStore) {
  try {
    await fetch(`${API}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sources: state.sources,
        services: state.services,
        statuses: state.statuses,
        priorities: state.priorities,
      }),
    })
  } catch {
    // best-effort sync
  }
}

export const useAdminConfigStore = create<AdminConfigStore>()((set, get) => ({
  // Start with mock data so UI renders immediately
  sources: [...mockSources],
  services: [...mockServices],
  statuses: [...mockStatuses],
  priorities: [...mockPriorities],
  loaded: false,

  init: async () => {
    if (get().loaded) return
    try {
      const res = await fetch(`${API}/config`)
      if (!res.ok) return
      const config = await res.json()
      set({
        sources: config.sources ?? get().sources,
        services: config.services ?? get().services,
        statuses: config.statuses ?? get().statuses,
        priorities: config.priorities ?? get().priorities,
        loaded: true,
      })
    } catch {
      set({ loaded: true })
    }
  },

  addItem: (category, data) => {
    const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
    const existing = get()[key] as ConfigItem[]
    const maxNum = existing.reduce((acc, i) => {
      const n = parseInt(i.id.replace(/^[a-z]+-/, ''), 10)
      return isNaN(n) ? acc : Math.max(acc, n)
    }, 0)
    const newItem: ConfigItem = { ...data, id: `cfg-${maxNum + 1}`, isSystem: false, category }
    set((s) => ({ [key]: [...(s[key] as ConfigItem[]), newItem] }))
    syncConfig(get())
    return newItem
  },

  updateItem: (category, id, updates) => {
    const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
    set((s) => ({
      [key]: (s[key] as ConfigItem[]).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
    syncConfig(get())
  },

  deleteItem: (category, id) => {
    const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
    const item = (get()[key] as ConfigItem[]).find((i) => i.id === id)
    if (item?.isSystem) return
    set((s) => ({
      [key]: (s[key] as ConfigItem[]).filter((i) => i.id !== id),
    }))
    syncConfig(get())
  },

  toggleActive: (category, id) => {
    const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
    set((s) => ({
      [key]: (s[key] as ConfigItem[]).map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      ),
    }))
    syncConfig(get())
  },

  reorder: (category, items) => {
    const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
    set({ [key]: items })
    syncConfig(get())
  },
}))
