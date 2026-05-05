import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSlaSettings, saveSlaSettings, type SlaDaysMap } from '@/services/slaService'
import { SLA_DAYS } from '@/types/task'

export function useSlaSettings() {
  return useQuery<SlaDaysMap>({
    queryKey: ['sla-settings'],
    queryFn: getSlaSettings,
    staleTime: 5 * 60 * 1000,
    placeholderData: SLA_DAYS as SlaDaysMap,
  })
}

export function useSaveSlaSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveSlaSettings,
    onSuccess: (data) => {
      qc.setQueryData(['sla-settings'], data)
    },
  })
}
