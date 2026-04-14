/**
 * useConfigOptions — single source of truth bridge between the admin config
 * store and every component in the main app that needs dropdown options or
 * display labels.
 *
 * • Dropdown arrays: only ACTIVE items, sorted by `order`
 * • Label / color maps: ALL items (so existing tasks display correctly even if
 *   a source is later deactivated)
 * • ASSIGNEES: active users from adminUsersStore (for new task assignment)
 * • ALL_ASSIGNEES: all users including inactive (for filters on existing tasks)
 */
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'

export function useConfigOptions() {
  const { sources, services, statuses, priorities } = useAdminConfigStore()
  const { users } = useAdminUsersStore()

  // ── Assignees ──────────────────────────────────────────────────────────────
  // ASSIGNEES: active users only — for new task / reassignment dropdowns
  const ASSIGNEES: string[] = users
    .filter((u) => u.status === 'active')
    .map((u) => u.name)

  // ALL_ASSIGNEES: active + inactive — for filter dropdowns so you can still
  // filter tasks that were assigned to a now-deactivated user
  const ALL_ASSIGNEES: string[] = users.map((u) => u.name)

  // ── Active-only, ordered (for <Select> dropdowns) ──────────────────────────
  const REQUEST_SOURCES = sources
    .filter((i) => i.isActive)
    .sort((a, b) => a.order - b.order)
    .map((i) => ({ value: i.value, label: i.label }))

  const SERVICE_TYPES = services
    .filter((i) => i.isActive)
    .sort((a, b) => a.order - b.order)
    .map((i) => ({ value: i.value, label: i.label }))

  const STATUS_OPTIONS = statuses
    .filter((i) => i.isActive)
    .sort((a, b) => a.order - b.order)
    .map((i) => ({ value: i.value, label: i.label }))

  const PRIORITY_OPTIONS = priorities
    .filter((i) => i.isActive)
    .sort((a, b) => a.order - b.order)
    .map((i) => ({ value: i.value, label: i.label }))

  // ── Label maps (all items, for display in tables / badges) ─────────────────
  const SOURCE_LABEL: Record<string, string> = Object.fromEntries(
    sources.map((i) => [i.value, i.label])
  )
  const SERVICE_LABEL: Record<string, string> = Object.fromEntries(
    services.map((i) => [i.value, i.label])
  )
  const STATUS_LABEL: Record<string, string> = Object.fromEntries(
    statuses.map((i) => [i.value, i.label])
  )
  const PRIORITY_LABEL: Record<string, string> = Object.fromEntries(
    priorities.map((i) => [i.value, i.label])
  )

  // ── Color maps (all items, for charts) ─────────────────────────────────────
  const SOURCE_COLORS: Record<string, string> = Object.fromEntries(
    sources.map((i) => [i.value, i.color])
  )
  const SERVICE_COLORS: Record<string, string> = Object.fromEntries(
    services.map((i) => [i.value, i.color])
  )

  return {
    REQUEST_SOURCES,
    SERVICE_TYPES,
    STATUS_OPTIONS,
    PRIORITY_OPTIONS,
    SOURCE_LABEL,
    SERVICE_LABEL,
    STATUS_LABEL,
    PRIORITY_LABEL,
    SOURCE_COLORS,
    SERVICE_COLORS,
    ASSIGNEES,
    ALL_ASSIGNEES,
  }
}

/**
 * getConfigSnapshot — non-React equivalent for use inside plain async
 * functions (e.g. statsService.ts). Reads the Zustand store state directly
 * without a hook.
 */
export function getConfigSnapshot() {
  const { sources, services, statuses } = useAdminConfigStore.getState()
  const { users } = useAdminUsersStore.getState()
  const ALL_ASSIGNEES = users.map((u) => u.name)
  const ASSIGNEES = users.filter((u) => u.status === 'active').map((u) => u.name)

  const SOURCE_LABEL: Record<string, string> = Object.fromEntries(
    sources.map((i) => [i.value, i.label])
  )
  const SERVICE_LABEL: Record<string, string> = Object.fromEntries(
    services.map((i) => [i.value, i.label])
  )
  const SOURCE_COLORS: Record<string, string> = Object.fromEntries(
    sources.map((i) => [i.value, i.color])
  )
  const SERVICE_COLORS: Record<string, string> = Object.fromEntries(
    services.map((i) => [i.value, i.color])
  )
  const STATUS_LABEL: Record<string, string> = Object.fromEntries(
    statuses.map((i) => [i.value, i.label])
  )
  const STATUS_COLORS: Record<string, string> = Object.fromEntries(
    statuses.map((i) => [i.value, i.color])
  )
  const ALL_SOURCES = sources.map((i) => i.value)

  return { SOURCE_LABEL, SERVICE_LABEL, SOURCE_COLORS, SERVICE_COLORS, STATUS_LABEL, STATUS_COLORS, ALL_SOURCES, ASSIGNEES, ALL_ASSIGNEES }
}
