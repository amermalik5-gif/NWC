import { useFilterStore } from '@/store/filterStore'

export function useFilters() {
  const filters = useFilterStore((s) => s.filters)
  const setFilter = useFilterStore((s) => s.setFilter)
  const setFilters = useFilterStore((s) => s.setFilters)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const activeFilterCount = [
    filters.requestSource !== 'all',
    filters.serviceType !== 'all',
    filters.status !== 'all',
    filters.priority !== 'all',
    filters.assignedTo !== 'all',
    !!filters.dateRangeStart || !!filters.dateRangeEnd,
    !!filters.search,
  ].filter(Boolean).length

  return { filters, setFilter, setFilters, resetFilters, activeFilterCount }
}
