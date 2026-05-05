import { Clock, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'
import { getSlaStatus, SLA_DAYS } from '@/types/task'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

interface Props {
  task: Task
  showLabel?: boolean
}

export function SlaBadge({ task, showLabel = true }: Props) {
  const status = getSlaStatus(task)
  if (!status) return null

  const serviceType = task.serviceTypes?.[0]
  const slaDays = serviceType ? SLA_DAYS[serviceType] : null

  const configs = {
    on_track: {
      label: 'On Track',
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    at_risk: {
      label: 'At Risk',
      icon: AlertTriangle,
      className: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    breached: {
      label: 'SLA Breached',
      icon: XCircle,
      className: 'bg-red-100 text-red-700 border-red-200',
    },
  }

  const { label, icon: Icon, className } = configs[status]

  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>
        {showLabel ? label : ''}
        {slaDays && showLabel && ` (SLA: ${slaDays}d)`}
      </span>
    </div>
  )
}
