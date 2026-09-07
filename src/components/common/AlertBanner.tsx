import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, X } from 'lucide-react'
import { useTaskStats } from '@/hooks/useTaskStats'
import { DEFAULT_FILTERS } from '@/types/filters'
import { useFilterStore } from '@/store/filterStore'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function AlertBanner() {
  const [dismissed, setDismissed] = useState(false)
  const { data: stats } = useTaskStats(DEFAULT_FILTERS)
  const navigate = useNavigate()
  const setFilter = useFilterStore((s) => s.setFilter)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  if (dismissed || !stats) return null

  const overdueCount = stats.overdue ?? 0

  // Count tasks due today and this week (derived from stats isn't direct; we just show overdue prominently)
  if (overdueCount === 0) return null

  function goToOverdue() {
    resetFilters()
    setFilter('status', 'all')
    navigate(ROUTES.TASKS + '?overdue=1')
  }

  return (
    <div className={cn(
      'flex items-center gap-3 px-6 py-2.5 text-sm',
      'bg-red-50 border-b border-red-200 text-red-800'
    )}>
      <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
      <span className="flex-1">
        <button
          onClick={goToOverdue}
          className="font-semibold underline underline-offset-2 hover:text-red-900 transition-colors"
        >
          {overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}
        </button>
        {' '}— click to review
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="rounded p-0.5 hover:bg-red-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
