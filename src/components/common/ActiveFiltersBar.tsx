import { FilterBadge } from './FilterBadge'
import { Button } from '@/components/ui/button'
import { useFilters } from '@/hooks/useFilters'
import {
  REQUEST_SOURCES,
  SERVICE_TYPES,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from '@/constants/taskConstants'
import { MOCK_USERS } from '@/data/mock/users'

export function ActiveFiltersBar() {
  const { filters, setFilter, resetFilters, activeFilterCount } = useFilters()

  if (activeFilterCount === 0) return null

  const sourceLabel = REQUEST_SOURCES.find((s) => s.value === filters.requestSource)?.label
  const serviceLabel = SERVICE_TYPES.find((s) => s.value === filters.serviceType)?.label
  const statusLabel = STATUS_OPTIONS.find((s) => s.value === filters.status)?.label
  const priorityLabel = PRIORITY_OPTIONS.find((s) => s.value === filters.priority)?.label

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs text-slate-500 font-medium">Active filters:</span>

      {filters.search && (
        <FilterBadge
          label="Search"
          value={filters.search}
          onRemove={() => setFilter('search', '')}
        />
      )}
      {filters.requestSource !== 'all' && sourceLabel && (
        <FilterBadge
          label="Source"
          value={sourceLabel}
          onRemove={() => setFilter('requestSource', 'all')}
        />
      )}
      {filters.serviceType !== 'all' && serviceLabel && (
        <FilterBadge
          label="Service"
          value={serviceLabel}
          onRemove={() => setFilter('serviceType', 'all')}
        />
      )}
      {filters.status !== 'all' && statusLabel && (
        <FilterBadge
          label="Status"
          value={statusLabel}
          onRemove={() => setFilter('status', 'all')}
        />
      )}
      {filters.priority !== 'all' && priorityLabel && (
        <FilterBadge
          label="Priority"
          value={priorityLabel}
          onRemove={() => setFilter('priority', 'all')}
        />
      )}
      {filters.assignedTo !== 'all' && (
        <FilterBadge
          label="Assigned"
          value={filters.assignedTo}
          onRemove={() => setFilter('assignedTo', 'all')}
        />
      )}
      {(filters.dateRangeStart || filters.dateRangeEnd) && (
        <FilterBadge
          label="Date range"
          value={`${filters.dateRangeStart ?? '…'} – ${filters.dateRangeEnd ?? '…'}`}
          onRemove={() => {
            setFilter('dateRangeStart', null)
            setFilter('dateRangeEnd', null)
          }}
        />
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="h-6 px-2 text-xs text-slate-500 hover:text-slate-900"
      >
        Clear all
      </Button>
    </div>
  )
}
