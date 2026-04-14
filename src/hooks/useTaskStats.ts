import { useQuery } from '@tanstack/react-query'
import { getTaskStats } from '@/services/statsService'
import type { TaskFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'

export function useTaskStats(filters: TaskFilters = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: ['task-stats', filters],
    queryFn: () => getTaskStats(filters),
    placeholderData: (prev) => prev,
  })
}
