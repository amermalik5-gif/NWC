import { Search, X, CalendarRange } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useFilters } from '@/hooks/useFilters'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { useDebounce } from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'

export function DashboardFilterBar() {
  const { filters, setFilter, resetFilters, activeFilterCount } = useFilters()
  const { REQUEST_SOURCES, SERVICE_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS, ALL_ASSIGNEES } = useConfigOptions()
  const [searchValue, setSearchValue] = useState(filters.search)
  const debouncedSearch = useDebounce(searchValue, 300)

  useEffect(() => {
    setFilter('search', debouncedSearch)
  }, [debouncedSearch, setFilter])

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      {/* Row 1 — main filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Source */}
        <Select
          value={filters.requestSource}
          onValueChange={(v) => setFilter('requestSource', v as typeof filters.requestSource)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {REQUEST_SOURCES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Service */}
        <Select
          value={filters.serviceType}
          onValueChange={(v) => setFilter('serviceType', v as typeof filters.serviceType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {SERVICE_TYPES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(v) => setFilter('status', v as typeof filters.status)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={filters.priority}
          onValueChange={(v) => setFilter('priority', v as typeof filters.priority)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITY_OPTIONS.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Assigned To */}
        <Select
          value={filters.assignedTo}
          onValueChange={(v) => setFilter('assignedTo', v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            {ALL_ASSIGNEES.map((user) => (
              <SelectItem key={user} value={user}>{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchValue('')
              resetFilters()
            }}
            className="gap-1 text-slate-500"
          >
            <X className="h-4 w-4" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Row 2 — date range */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <CalendarRange className="h-3.5 w-3.5" />
          Date Filter
        </div>

        {/* Field selector */}
        <Select
          value={filters.dateFilterField}
          onValueChange={(v) => setFilter('dateFilterField', v as typeof filters.dateFilterField)}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="requestDate">Request Date</SelectItem>
            <SelectItem value="both">Either Date</SelectItem>
          </SelectContent>
        </Select>

        {/* From */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 whitespace-nowrap">From</span>
          <Input
            type="date"
            value={filters.dateRangeStart ?? ''}
            onChange={(e) => setFilter('dateRangeStart', e.target.value || null)}
            className="h-8 w-[140px] text-xs"
          />
        </div>

        {/* To */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 whitespace-nowrap">To</span>
          <Input
            type="date"
            value={filters.dateRangeEnd ?? ''}
            onChange={(e) => setFilter('dateRangeEnd', e.target.value || null)}
            className="h-8 w-[140px] text-xs"
          />
        </div>

        {(filters.dateRangeStart || filters.dateRangeEnd) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1 text-slate-500"
            onClick={() => {
              setFilter('dateRangeStart', null)
              setFilter('dateRangeEnd', null)
            }}
          >
            <X className="h-3 w-3" />
            Clear dates
          </Button>
        )}
      </div>
    </div>
  )
}
