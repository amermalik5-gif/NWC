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

export function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks
    .filter((t) => filters.requestSource === 'all' || t.requestSource === filters.requestSource)
    .filter((t) => filters.serviceType === 'all' || t.serviceType === filters.serviceType)
    .filter((t) => filters.status === 'all' || t.status === filters.status)
    .filter((t) => filters.priority === 'all' || t.priority === filters.priority)
    .filter((t) => filters.assignedTo === 'all' || t.assignedTo === filters.assignedTo)
    .filter((t) => !filters.search || matchesSearch(t, filters.search))
    .filter((t) => !filters.dateRangeStart || t.dueDate >= filters.dateRangeStart)
    .filter((t) => !filters.dateRangeEnd || t.dueDate <= filters.dateRangeEnd)
}
