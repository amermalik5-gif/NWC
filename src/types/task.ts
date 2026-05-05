export type TaskStatus =
  | 'new'
  | 'in_progress'
  | 'on_hold'
  | 'blocked'
  | 'completed'
  | 'cancelled'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type RequestSource =
  | 'vp_office'
  | 'infrastructure'
  | 'it_operations'
  | 'digital_transformation'
  | 'strategy'
  | 'applications'
  | 'others'

export type ServiceType =
  | 'presentation_design'
  | 'presentation_translation'
  | 'graphic_design'
  | 'content_writing'
  | 'event_management'

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly'

export interface TaskAttachment {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  url: string
}

export interface TaskComment {
  id: string
  taskId: string
  authorName: string
  authorId: string
  body: string
  createdAt: string
}

export interface ActivityEntry {
  id: string
  taskId: string
  authorName: string
  action: string   // e.g. "changed status from In Progress to Completed"
  field?: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface RecurringConfig {
  frequency: RecurringFrequency
  interval: number         // every N days/weeks/months
  endDate?: string | null  // ISO date or null (no end)
}

export interface Task {
  id: string
  title: string
  description: string
  requestSource: RequestSource
  /** One or more service types per task */
  serviceTypes: ServiceType[]
  requesterName: string
  assignedTo: string
  status: TaskStatus
  priority: TaskPriority
  /** Required when status === 'blocked'; null otherwise */
  blocker: string | null
  requestDate: string
  startDate: string | null
  dueDate: string
  completionDate: string | null
  notes: string
  attachments: TaskAttachment[]
  checklist: ChecklistItem[]
  recurring: RecurringConfig | null
  templateId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTaskInput = Partial<CreateTaskInput>

// ── SLA definitions per service type (business days) ──────────────────────────
export const SLA_DAYS: Record<ServiceType, number> = {
  presentation_design: 3,
  presentation_translation: 2,
  graphic_design: 5,
  content_writing: 4,
  event_management: 7,
}

export type SlaStatus = 'on_track' | 'at_risk' | 'breached'

export function getSlaStatus(task: Task): SlaStatus | null {
  if (task.status === 'completed' || task.status === 'cancelled') return null
  const serviceType = task.serviceTypes?.[0]
  if (!serviceType) return null
  const slaDays = SLA_DAYS[serviceType]
  const start = new Date(task.requestDate)
  const due = new Date(start)
  due.setDate(due.getDate() + slaDays)
  const now = new Date()
  const total = due.getTime() - start.getTime()
  const elapsed = now.getTime() - start.getTime()
  const pct = elapsed / total
  if (now > due) return 'breached'
  if (pct >= 0.75) return 'at_risk'
  return 'on_track'
}
