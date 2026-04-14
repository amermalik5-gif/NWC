/**
 * useConfigOptions — single source of truth bridge between the admin config
 * store and every component in the main app that needs dropdown options or
 * display labels.
 *
 * • Dropdown arrays: only ACTIVE items, sorted by `order`
 * • Label / color maps: ALL items (so existing tasks display correctly even if
 *   a source is later deactivated)
 */
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'

export function useConfigOptions() {
  const { sources, services, statuses, priorities } = useAdminConfigStore()

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
  }
}

/**
 * getConfigSnapshot — non-React equivalent for use inside plain async
 * functions (e.g. statsService.ts). Reads the Zustand store state directly
 * without a hook.
 */
export function getConfigSnapshot() {
  const { sources, services, statuses } = useAdminConfigStore.getState()

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

  return { SOURCE_LABEL, SERVICE_LABEL, SOURCE_COLORS, SERVICE_COLORS, STATUS_LABEL, STATUS_COLORS, ALL_SOURCES }
}
