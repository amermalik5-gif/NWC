import { useQuery } from '@tanstack/react-query'
import { getTaskById } from '@/services/taskService'

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTaskById(id!),
    enabled: !!id,
  })
}
