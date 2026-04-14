import type { TaskPriority } from '@/types/task'

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; badgeClass: string; order: number }
> = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    order: 1,
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    order: 2,
  },
  high: {
    label: 'High',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    order: 3,
  },
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    order: 4,
  },
}
