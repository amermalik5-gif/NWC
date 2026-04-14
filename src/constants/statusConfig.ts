import type { TaskStatus } from '@/types/task'

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  new: {
    label: 'New',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-500',
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  on_hold: {
    label: 'On Hold',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    dotClass: 'bg-orange-500',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    dotClass: 'bg-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    dotClass: 'bg-red-500',
  },
}
