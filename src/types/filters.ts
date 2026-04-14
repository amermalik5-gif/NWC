import type { TaskStatus, TaskPriority, RequestSource, ServiceType } from './task'

export interface TaskFilters {
  search: string
  requestSource: RequestSource | 'all'
  serviceType: ServiceType | 'all'
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  assignedTo: string | 'all'
  dateRangeStart: string | null
  dateRangeEnd: string | null
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: '',
  requestSource: 'all',
  serviceType: 'all',
  status: 'all',
  priority: 'all',
  assignedTo: 'all',
  dateRangeStart: null,
  dateRangeEnd: null,
}
