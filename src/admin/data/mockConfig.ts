import type { ConfigItem, SystemSettings, AuditLog } from '@/admin/types'

// ─── Request Sources ──────────────────────────────────────────────────────────
export const mockSources: ConfigItem[] = [
  { id: 'src-1', value: 'vp_office', label: 'VP Office', color: '#3b82f6', isActive: true, isSystem: true, order: 1, category: 'source' },
  { id: 'src-2', value: 'infrastructure', label: 'Infrastructure', color: '#8b5cf6', isActive: true, isSystem: true, order: 2, category: 'source' },
  { id: 'src-3', value: 'it_operations', label: 'IT Operations', color: '#ec4899', isActive: true, isSystem: true, order: 3, category: 'source' },
  { id: 'src-4', value: 'digital_transformation', label: 'Digital Transformation', color: '#f59e0b', isActive: true, isSystem: true, order: 4, category: 'source' },
  { id: 'src-5', value: 'strategy', label: 'Strategy', color: '#10b981', isActive: true, isSystem: true, order: 5, category: 'source' },
  { id: 'src-6', value: 'applications', label: 'Applications', color: '#6366f1', isActive: true, isSystem: true, order: 6, category: 'source' },
  { id: 'src-7', value: 'others', label: 'Others', color: '#94a3b8', isActive: true, isSystem: true, order: 7, category: 'source' },
]

// ─── Service Categories ───────────────────────────────────────────────────────
export const mockServices: ConfigItem[] = [
  { id: 'svc-1', value: 'presentation_design', label: 'Presentation Design', color: '#3b82f6', isActive: true, isSystem: true, order: 1, category: 'service' },
  { id: 'svc-2', value: 'presentation_translation', label: 'Presentation Translation', color: '#8b5cf6', isActive: true, isSystem: true, order: 2, category: 'service' },
  { id: 'svc-3', value: 'graphic_design', label: 'Graphic Design', color: '#f59e0b', isActive: true, isSystem: true, order: 3, category: 'service' },
  { id: 'svc-4', value: 'content_writing', label: 'Content Writing', color: '#10b981', isActive: true, isSystem: true, order: 4, category: 'service' },
  { id: 'svc-5', value: 'event_management', label: 'Event Management & Meeting Coordination', color: '#ec4899', isActive: true, isSystem: true, order: 5, category: 'service' },
]

// ─── Task Statuses ────────────────────────────────────────────────────────────
export const mockStatuses: ConfigItem[] = [
  { id: 'sts-1', value: 'new', label: 'New', color: '#94a3b8', isActive: true, isSystem: true, order: 1, category: 'status' },
  { id: 'sts-2', value: 'in_progress', label: 'In Progress', color: '#f59e0b', isActive: true, isSystem: true, order: 2, category: 'status' },
  { id: 'sts-3', value: 'on_hold', label: 'On Hold', color: '#f97316', isActive: true, isSystem: true, order: 3, category: 'status' },
  { id: 'sts-4', value: 'blocked', label: 'Blocked', color: '#e11d48', isActive: true, isSystem: true, order: 4, category: 'status' },
  { id: 'sts-5', value: 'completed', label: 'Completed', color: '#10b981', isActive: true, isSystem: true, order: 5, category: 'status' },
  { id: 'sts-6', value: 'cancelled', label: 'Cancelled', color: '#ef4444', isActive: true, isSystem: true, order: 6, category: 'status' },
]

// ─── Priority Levels ──────────────────────────────────────────────────────────
export const mockPriorities: ConfigItem[] = [
  { id: 'pri-1', value: 'low', label: 'Low', color: '#94a3b8', isActive: true, isSystem: true, order: 1, category: 'priority' },
  { id: 'pri-2', value: 'medium', label: 'Medium', color: '#3b82f6', isActive: true, isSystem: true, order: 2, category: 'priority' },
  { id: 'pri-3', value: 'high', label: 'High', color: '#f97316', isActive: true, isSystem: true, order: 3, category: 'priority' },
  { id: 'pri-4', value: 'urgent', label: 'Urgent', color: '#ef4444', isActive: true, isSystem: true, order: 4, category: 'priority' },
]

// ─── System Settings ──────────────────────────────────────────────────────────
export const defaultSettings: SystemSettings = {
  appName: 'NWC Task Tracker',
  appTagline: 'Internal task management system',
  primaryColor: '#3b82f6',
  notifications: {
    emailOnNewTask: true,
    emailOnStatusChange: true,
    emailOnOverdue: true,
    overdueReminderDays: 1,
  },
  workflow: {
    defaultStatus: 'new',
    defaultPriority: 'medium',
    requireDueDate: true,
    requireAssignee: true,
    allowSelfAssign: true,
  },
  dashboardWidgets: [
    { id: 'summary-cards', label: 'Summary KPI Cards', description: 'Total, Open, In Progress, Completed, Overdue counts', visible: true, order: 1 },
    { id: 'source-chart', label: 'Tasks by Source Chart', description: 'Horizontal bar chart showing task distribution by department', visible: true, order: 2 },
    { id: 'service-chart', label: 'Tasks by Service Chart', description: 'Bar chart showing tasks per service type', visible: true, order: 3 },
    { id: 'status-chart', label: 'Tasks by Status Chart', description: 'Donut chart showing status distribution', visible: true, order: 4 },
    { id: 'monthly-trend', label: 'Monthly Trend Chart', description: 'Line chart for created vs completed tasks over 6 months', visible: true, order: 5 },
    { id: 'upcoming-deadlines', label: 'Upcoming Deadlines', description: 'Tasks due within the next 7 days', visible: true, order: 6 },
    { id: 'source-breakdown', label: 'Source Breakdown Table', description: 'Per-department totals with completion rates', visible: true, order: 7 },
    { id: 'recent-tasks', label: 'Recent Tasks Table', description: 'Last 10 tasks with quick actions', visible: true, order: 8 },
  ],
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const mockAuditLogs: AuditLog[] = [
  { id: 'log-001', action: 'login', actor: 'amerrawahneh', detail: 'Admin login successful', timestamp: '2026-04-14T09:30:00Z', ip: '192.168.1.10' },
  { id: 'log-002', action: 'update_task', actor: 'amerrawahneh', target: 'TASK-032', detail: 'Status changed from new to in_progress', timestamp: '2026-04-14T09:45:00Z' },
  { id: 'log-003', action: 'create_user', actor: 'amerrawahneh', target: 'USR-010', detail: 'Created user rania.kareem', timestamp: '2026-04-13T14:10:00Z' },
  { id: 'log-004', action: 'update_settings', actor: 'amerrawahneh', detail: 'Updated notification settings', timestamp: '2026-04-13T11:00:00Z' },
  { id: 'log-005', action: 'delete_task', actor: 'amerrawahneh', target: 'TASK-029', detail: 'Task deleted: Others Department Welcome Brochure', timestamp: '2026-04-12T16:30:00Z' },
  { id: 'log-006', action: 'update_config', actor: 'amerrawahneh', target: 'src-7', detail: 'Config item updated: Others color changed', timestamp: '2026-04-12T10:00:00Z' },
  { id: 'log-007', action: 'update_user', actor: 'amerrawahneh', target: 'USR-010', detail: 'User rania.kareem deactivated', timestamp: '2026-04-11T15:00:00Z' },
  { id: 'log-008', action: 'login', actor: 'amerrawahneh', detail: 'Admin login successful', timestamp: '2026-04-11T08:55:00Z', ip: '192.168.1.10' },
  { id: 'log-009', action: 'create_task', actor: 'sara.mohammed', target: 'TASK-044', detail: 'Created task: Strategy Annual Report Presentation', timestamp: '2026-04-10T09:00:00Z' },
  { id: 'log-010', action: 'update_config', actor: 'amerrawahneh', target: 'svc-5', detail: 'Service label updated', timestamp: '2026-04-09T14:00:00Z' },
  { id: 'log-011', action: 'logout', actor: 'amerrawahneh', detail: 'Admin logout', timestamp: '2026-04-08T18:00:00Z' },
  { id: 'log-012', action: 'update_task', actor: 'ahmed.alrashid', target: 'TASK-009', detail: 'Status changed to completed', timestamp: '2026-04-08T17:00:00Z' },
]
