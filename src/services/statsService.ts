import { format, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import type { TaskStats, ChartDataPoint, MonthlyDataPoint, SourceStat } from '@/types/chart'
import type { TaskFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'
import { getAllTasks } from './taskService'
import { isOverdue } from '@/lib/dateHelpers'
import { SOURCE_LABEL, SERVICE_LABEL, SOURCE_COLORS, SERVICE_COLORS } from '@/constants/taskConstants'
import type { RequestSource, ServiceType } from '@/types/task'

export async function getTaskStats(filters: TaskFilters = DEFAULT_FILTERS): Promise<TaskStats> {
  const tasks = await getAllTasks(filters)

  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const cancelled = tasks.filter((t) => t.status === 'cancelled').length
  const onHold = tasks.filter((t) => t.status === 'on_hold').length
  const open = tasks.filter((t) => t.status === 'new' || t.status === 'in_progress' || t.status === 'on_hold').length
  const overdue = tasks.filter((t) => isOverdue(t)).length

  // By source
  const sourceMap = new Map<RequestSource, number>()
  for (const t of tasks) {
    sourceMap.set(t.requestSource, (sourceMap.get(t.requestSource) ?? 0) + 1)
  }
  const bySource: ChartDataPoint[] = Array.from(sourceMap.entries()).map(([key, value]) => ({
    name: SOURCE_LABEL[key],
    value,
    color: SOURCE_COLORS[key],
  })).sort((a, b) => b.value - a.value)

  // By service type
  const serviceMap = new Map<ServiceType, number>()
  for (const t of tasks) {
    serviceMap.set(t.serviceType, (serviceMap.get(t.serviceType) ?? 0) + 1)
  }
  const byServiceType: ChartDataPoint[] = Array.from(serviceMap.entries()).map(([key, value]) => ({
    name: SERVICE_LABEL[key],
    value,
    color: SERVICE_COLORS[key],
  })).sort((a, b) => b.value - a.value)

  // By status
  const statusLabels: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  const statusColors: Record<string, string> = {
    new: '#94a3b8',
    in_progress: '#f59e0b',
    on_hold: '#f97316',
    completed: '#10b981',
    cancelled: '#ef4444',
  }
  const statusMap = new Map<string, number>()
  for (const t of tasks) {
    statusMap.set(t.status, (statusMap.get(t.status) ?? 0) + 1)
  }
  const byStatus: ChartDataPoint[] = Array.from(statusMap.entries()).map(([key, value]) => ({
    name: statusLabels[key] ?? key,
    value,
    color: statusColors[key] ?? '#94a3b8',
  }))

  // Monthly trend (last 6 months — use ALL tasks, not filtered, for trend chart)
  const allTasks = await getAllTasks(DEFAULT_FILTERS)
  const byMonth: MonthlyDataPoint[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i)
    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)
    const monthLabel = format(monthDate, 'MMM yyyy')
    const created = allTasks.filter((t) => {
      const d = parseISO(t.requestDate)
      return d >= start && d <= end
    }).length
    const completedInMonth = allTasks.filter((t) => {
      if (!t.completionDate) return false
      const d = parseISO(t.completionDate)
      return d >= start && d <= end
    }).length
    byMonth.push({ month: monthLabel, created, completed: completedInMonth })
  }

  // Source breakdown table
  const sourceStats: SourceStat[] = (['vp_office', 'infrastructure', 'it_operations', 'digital_transformation', 'strategy', 'applications', 'others'] as RequestSource[]).map((src) => {
    const srcTasks = tasks.filter((t) => t.requestSource === src)
    const srcTotal = srcTasks.length
    const srcInProgress = srcTasks.filter((t) => t.status === 'in_progress').length
    const srcCompleted = srcTasks.filter((t) => t.status === 'completed').length
    const rate = srcTotal > 0 ? Math.round((srcCompleted / srcTotal) * 100) : 0
    return {
      source: SOURCE_LABEL[src],
      total: srcTotal,
      inProgress: srcInProgress,
      completed: srcCompleted,
      rate,
    }
  }).filter((s) => s.total > 0)

  return {
    total,
    open,
    inProgress,
    completed,
    cancelled,
    onHold,
    overdue,
    bySource,
    byServiceType,
    byStatus,
    byMonth,
    sourceStats,
  }
}
