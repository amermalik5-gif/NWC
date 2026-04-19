import type { Task } from '@/types/task'
import type { TaskFilters } from '@/types/filters'

function matchesSearch(task: Task, search: string): boolean {
  const q = search.toLowerCase()
  return (
    task.title.toLowerCase().includes(q) ||
    task.id.toLowerCase().includes(q) ||
    task.requesterName.toLowerCase().includes(q) ||
    task.assignedTo.toLowerCase().includes(q) ||
    task.description.toLowerCase().includes(q)
  )
}

function matchesDateRange(task: Task, filters: TaskFilters): boolean {
  const { dateRangeStart, dateRangeEnd, dateFilterField } = filters
  if (!dateRangeStart && !dateRangeEnd) return true

  const checkDate = (dateStr: string | null): boolean => {
    if (!dateStr) return false
    return (
      (!dateRangeStart || dateStr >= dateRangeStart) &&
      (!dateRangeEnd || dateStr <= dateRangeEnd)
    )
  }

  if (dateFilterField === 'requestDate') return checkDate(task.requestDate)
  if (dateFilterField === 'dueDate') return checkDate(task.dueDate)
  // 'both' — task matches if either date falls in the range
  return checkDate(task.requestDate) || checkDate(task.dueDate)
}

export function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks
    .filter((t) => filters.requestSource === 'all' || t.requestSource === filters.requestSource)
    .filter((t) => filters.serviceType === 'all' || t.serviceTypes.includes(filters.serviceType as any))
    .filter((t) => filters.status === 'all' || t.status === filters.status)
    .filter((t) => filters.priority === 'all' || t.priority === filters.priority)
    .filter((t) => filters.assignedTo === 'all' || t.assignedTo === filters.assignedTo)
    .filter((t) => !filters.search || matchesSearch(t, filters.search))
    .filter((t) => matchesDateRange(t, filters))
}
