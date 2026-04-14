import { create } from 'zustand'
import { DEFAULT_FILTERS, type TaskFilters } from '@/types/filters'

interface FilterStore {
  filters: TaskFilters
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}))
