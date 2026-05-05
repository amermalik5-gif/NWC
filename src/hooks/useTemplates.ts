import { useQuery } from '@tanstack/react-query'
import { getTemplates } from '@/services/templateService'

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates,
    staleTime: 10 * 60 * 1000,
  })
}
