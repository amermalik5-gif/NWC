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

export interface TaskAttachment {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  url: string
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
  createdAt: string
  updatedAt: string
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTaskInput = Partial<CreateTaskInput>
