import { useQuery } from '@tanstack/react-query'
import { getTasks, getAllTasks } from '@/services/taskService'
import type { TaskFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'

export function useTasks(filters: TaskFilters = DEFAULT_FILTERS, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['tasks', filters, page, pageSize],
    queryFn: () => getTasks(filters, page, pageSize),
    placeholderData: (prev) => prev,
  })
}

export function useAllTasks(filters: TaskFilters = DEFAULT_FILTERS) {
  return useQuery({
    queryKey: ['tasks-all', filters],
    queryFn: () => getAllTasks(filters),
  })
}
