import { cn } from '@/lib/utils'
import { PRIORITY_CONFIG } from '@/constants/priorityConfig'
import type { TaskPriority } from '@/types/task'

interface TaskPriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.badgeClass,
        className
      )}
    >
      {config.label}
    </span>
  )
}
