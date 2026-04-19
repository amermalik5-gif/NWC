import { ListChecks, CircleDot, Timer, CheckCircle2, AlertCircle, Ban } from 'lucide-react'
import { SummaryCard } from './SummaryCard'
import type { TaskStats } from '@/types/chart'

interface SummaryCardsProps {
  stats?: TaskStats
  loading?: boolean
}

export function SummaryCards({ stats, loading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <SummaryCard
        label="Total Tasks"
        value={stats?.total ?? 0}
        icon={ListChecks}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        loading={loading}
      />
      <SummaryCard
        label="Open"
        value={stats?.open ?? 0}
        icon={CircleDot}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        loading={loading}
      />
      <SummaryCard
        label="In Progress"
        value={stats?.inProgress ?? 0}
        icon={Timer}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        loading={loading}
      />
      <SummaryCard
        label="Completed"
        value={stats?.completed ?? 0}
        icon={CheckCircle2}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        loading={loading}
      />
      <SummaryCard
        label="Blocked"
        value={stats?.blocked ?? 0}
        icon={Ban}
        iconBg="bg-rose-100"
        iconColor="text-rose-600"
        loading={loading}
        highlight={(stats?.blocked ?? 0) > 0}
      />
      <SummaryCard
        label="Overdue"
        value={stats?.overdue ?? 0}
        icon={AlertCircle}
        iconBg="bg-red-100"
        iconColor="text-red-600"
        loading={loading}
        highlight={(stats?.overdue ?? 0) > 0}
      />
    </div>
  )
}
