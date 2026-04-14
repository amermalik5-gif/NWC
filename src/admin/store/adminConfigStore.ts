import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ConfigItem, ConfigCategory } from '@/admin/types'
import { mockSources, mockServices, mockStatuses, mockPriorities } from '@/admin/data/mockConfig'

interface AdminConfigStore {
  sources: ConfigItem[]
  services: ConfigItem[]
  statuses: ConfigItem[]
  priorities: ConfigItem[]

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

export const useAdminConfigStore = create<AdminConfigStore>()(
  persist(
    (set, get) => ({
      sources: [...mockSources],
      services: [...mockServices],
      statuses: [...mockStatuses],
      priorities: [...mockPriorities],

      addItem: (category, data) => {
        const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
        // Derive unique numeric ID from existing items
        const existing = get()[key] as ConfigItem[]
        const maxNum = existing.reduce((acc, i) => {
          const n = parseInt(i.id.replace(/^[a-z]+-/, ''), 10)
          return isNaN(n) ? acc : Math.max(acc, n)
        }, 0)
        const newItem: ConfigItem = {
          ...data,
          id: `cfg-${maxNum + 1}`,
          isSystem: false,
          category,
        }
        set((s) => ({ [key]: [...(s[key] as ConfigItem[]), newItem] }))
        return newItem
      },

      updateItem: (category, id, updates) => {
        const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
        set((s) => ({
          [key]: (s[key] as ConfigItem[]).map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }))
      },

      deleteItem: (category, id) => {
        const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
        const item = (get()[key] as ConfigItem[]).find((i) => i.id === id)
        if (item?.isSystem) return // protect system items
        set((s) => ({
          [key]: (s[key] as ConfigItem[]).filter((i) => i.id !== id),
        }))
      },

      toggleActive: (category, id) => {
        const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
        set((s) => ({
          [key]: (s[key] as ConfigItem[]).map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          ),
        }))
      },

      reorder: (category, items) => {
        const key = categoryKey[category] as 'sources' | 'services' | 'statuses' | 'priorities'
        set({ [key]: items })
      },
    }),
    {
      name: 'nwc-admin-config',
    }
  )
)
