import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TaskTable } from '@/components/tasks/TaskTable'
import { ActiveFiltersBar } from '@/components/common/ActiveFiltersBar'
import { ExportButton } from '@/components/common/ExportButton'
import { useTasks, useAllTasks } from '@/hooks/useTasks'
import { useFilters } from '@/hooks/useFilters'
import { useDebounce } from '@/hooks/useDebounce'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { MOCK_USERS } from '@/data/mock/users'
import { ROUTES } from '@/constants/routes'

export function TaskListPage() {
  const { filters, setFilter, resetFilters, activeFilterCount } = useFilters()
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState(filters.search)
  const debouncedSearch = useDebounce(searchValue, 300)

  useEffect(() => {
    setFilter('search', debouncedSearch)
    setPage(1)
  }, [debouncedSearch, setFilter])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [
    filters.requestSource,
    filters.serviceType,
    filters.status,
    filters.priority,
    filters.assignedTo,
  ])

  const PAGE_SIZE = 20
  const { data, isLoading } = useTasks(filters, page, PAGE_SIZE)
  const { data: allFiltered } = useAllTasks(filters)
  const { REQUEST_SOURCES, SERVICE_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS } = useConfigOptions()

  return (
    <>
      <Header
        title="All Tasks"
        subtitle={data ? `${data.total} tasks` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton tasks={allFiltered ?? []} />
            <Button size="sm" asChild>
              <Link to={ROUTES.TASK_NEW}>
                <Plus className="h-4 w-4" />
                New Task
              </Link>
            </Button>
          </div>
        }
      />
      <PageWrapper>
        <div className="space-y-4 max-w-[1400px]">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-4 shadow-sm">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9"
              />
            </div>

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

            <Select
              value={filters.assignedTo}
              onValueChange={(v) => setFilter('assignedTo', v)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {MOCK_USERS.map((user) => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchValue(''); resetFilters() }}
                className="gap-1 text-slate-500"
              >
                <X className="h-4 w-4" />
                Clear ({activeFilterCount})
              </Button>
            )}
          </div>

          <ActiveFiltersBar />

          <TaskTable
            tasks={data?.data}
            loading={isLoading}
            filtered={activeFilterCount > 0}
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.total ?? 0}
            onPageChange={setPage}
          />
        </div>
      </PageWrapper>
    </>
  )
}
