// ─── User & Roles ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'team_member' | 'viewer'

export interface AdminUser {
  id: string
  username: string
  /** Plain-text password for mock/demo. Hash in production. */
  password?: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  department?: string
  createdAt: string
  lastLogin: string | null
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean
  user: { username: string; role: UserRole } | null
  token: string | null
}

// ─── Configuration Items ──────────────────────────────────────────────────────

export type ConfigCategory = 'source' | 'service' | 'status' | 'priority'

export interface ConfigItem {
  id: string
  value: string
  label: string
  color: string
  isActive: boolean
  isSystem: boolean   // system items cannot be deleted
  order: number
  category: ConfigCategory
}

// ─── Dashboard Widget Config ──────────────────────────────────────────────────

export interface DashboardWidget {
  id: string
  label: string
  description: string
  visible: boolean
  order: number
}

// ─── System Settings ──────────────────────────────────────────────────────────

export interface NotificationSettings {
  emailOnNewTask: boolean
  emailOnStatusChange: boolean
  emailOnOverdue: boolean
  overdueReminderDays: number
}

export interface WorkflowSettings {
  defaultStatus: string
  defaultPriority: string
  requireDueDate: boolean
  requireAssignee: boolean
  allowSelfAssign: boolean
}

export interface SystemSettings {
  appName: string
  appTagline: string
  primaryColor: string
  notifications: NotificationSettings
  workflow: WorkflowSettings
  dashboardWidgets: DashboardWidget[]
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'login'
  | 'logout'
  | 'create_task'
  | 'update_task'
  | 'delete_task'
  | 'create_user'
  | 'update_user'
  | 'delete_user'
  | 'update_config'
  | 'update_settings'

export interface AuditLog {
  id: string
  action: AuditAction
  actor: string
  target?: string
  detail: string
  timestamp: string
  ip?: string
}
