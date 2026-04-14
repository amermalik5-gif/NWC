import type { RequestSource, ServiceType, TaskStatus, TaskPriority } from '@/types/task'

export const REQUEST_SOURCES: { value: RequestSource; label: string }[] = [
  { value: 'vp_office', label: 'VP Office' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'it_operations', label: 'IT Operations' },
  { value: 'digital_transformation', label: 'Digital Transformation' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'applications', label: 'Applications' },
  { value: 'others', label: 'Others' },
]

export const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'presentation_design', label: 'Presentation Design' },
  { value: 'presentation_translation', label: 'Presentation Translation' },
  { value: 'graphic_design', label: 'Graphic Design' },
  { value: 'content_writing', label: 'Content Writing' },
  { value: 'event_management', label: 'Event Management & Meeting Coordination' },
]

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export const SOURCE_LABEL: Record<RequestSource, string> = {
  vp_office: 'VP Office',
  infrastructure: 'Infrastructure',
  it_operations: 'IT Operations',
  digital_transformation: 'Digital Transformation',
  strategy: 'Strategy',
  applications: 'Applications',
  others: 'Others',
}

export const SERVICE_LABEL: Record<ServiceType, string> = {
  presentation_design: 'Presentation Design',
  presentation_translation: 'Presentation Translation',
  graphic_design: 'Graphic Design',
  content_writing: 'Content Writing',
  event_management: 'Event Management & Coordination',
}

export const SOURCE_COLORS: Record<RequestSource, string> = {
  vp_office: '#3b82f6',
  infrastructure: '#8b5cf6',
  it_operations: '#ec4899',
  digital_transformation: '#f59e0b',
  strategy: '#10b981',
  applications: '#6366f1',
  others: '#94a3b8',
}

export const SERVICE_COLORS: Record<ServiceType, string> = {
  presentation_design: '#3b82f6',
  presentation_translation: '#8b5cf6',
  graphic_design: '#f59e0b',
  content_writing: '#10b981',
  event_management: '#ec4899',
}
