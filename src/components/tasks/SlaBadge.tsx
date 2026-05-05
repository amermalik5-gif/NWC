import { Clock, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'
import { getSlaStatus } from '@/types/task'
import { useSlaSettings } from '@/hooks/useSlaSettings'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

interface Props {
  task: Task
  showLabel?: boolean
}

export function SlaBadge({ task, showLabel = true }: Props) {
  const { data: slaDays } = useSlaSettings()
  const status = getSlaStatus(task, slaDays)
  if (!status) return null

  const serviceType = task.serviceTypes?.[0]
  const days = serviceType && slaDays ? slaDays[serviceType] : null

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
        {days && showLabel && ` (SLA: ${days}d)`}
      </span>
    </div>
  )
}
