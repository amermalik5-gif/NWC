import type { ServiceType } from '@/types/task'

export type SlaDaysMap = Record<ServiceType, number>

const DEFAULT_SLA_DAYS: SlaDaysMap = {
  presentation_design: 3,
  presentation_translation: 2,
  graphic_design: 5,
  content_writing: 4,
  event_management: 7,
}

export async function getSlaSettings(): Promise<SlaDaysMap> {
  const res = await fetch('/api/settings/sla')
  if (!res.ok) return DEFAULT_SLA_DAYS
  return res.json()
}

export async function saveSlaSettings(days: SlaDaysMap): Promise<SlaDaysMap> {
  const res = await fetch('/api/settings/sla', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(days),
  })
  if (!res.ok) throw new Error('Failed to save SLA settings')
  return res.json()
}
