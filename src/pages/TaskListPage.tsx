import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, X, CheckSquare, Trash2, SquareDashed, FileDown, Printer } from 'lucide-react'
import { useUserAuthStore } from '@/store/userAuthStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TaskTable } from '@/components/tasks/TaskTable'
import { ActiveFiltersBar } from '@/components/common/ActiveFiltersBar'
import { ExportButton } from '@/components/common/ExportButton'
import { useTasks, useAllTasks } from '@/hooks/useTasks'
import { useFilters } from '@/hooks/useFilters'
import { useDebounce } from '@/hooks/useDebounce'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { useBulkUpdateTasks, useDeleteTask } from '@/hooks/useTaskMutations'
import { useToast } from '@/hooks/useToast'
import { ROUTES } from '@/constants/routes'
import type { TaskStatus, TaskPriority } from '@/types/task'

export function TaskListPage() {
  const { filters, setFilter, resetFilters, activeFilterCount } = useFilters()
  const { isAuthenticated, user } = useUserAuthStore()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [searchValue, setSearchValue] = useState(filters.search)
  const debouncedSearch = useDebounce(searchValue, 300)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const bulkUpdate = useBulkUpdateTasks()
  const deleteTask = useDeleteTask()

  useEffect(() => {
    setFilter('search', debouncedSearch)
    setPage(1)
  }, [debouncedSearch, setFilter])

  useEffect(() => { setPage(1) }, [
    filters.requestSource, filters.serviceType, filters.status, filters.priority, filters.assignedTo,
  ])

  // Clear selection when filters change
  useEffect(() => { setSelectedIds(new Set()) }, [filters])

  const PAGE_SIZE = 20
  const { data, isLoading } = useTasks(filters, page, PAGE_SIZE)
  const { data: allFiltered } = useAllTasks(filters)
  const { REQUEST_SOURCES, SERVICE_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS, ALL_ASSIGNEES } = useConfigOptions()

  const selectedCount = selectedIds.size

  const handleBulkStatus = (status: TaskStatus) => {
    bulkUpdate.mutate(
      { ids: [...selectedIds], update: { status }, updatedBy: user?.name },
      {
        onSuccess: ({ updated }) => {
          toast({ title: `Updated ${updated} task${updated !== 1 ? 's' : ''}`, description: `Status set to ${status.replace('_', ' ')}` })
          setSelectedIds(new Set())
        },
      }
    )
  }

  const handleBulkPriority = (priority: TaskPriority) => {
    bulkUpdate.mutate(
      { ids: [...selectedIds], update: { priority }, updatedBy: user?.name },
      {
        onSuccess: ({ updated }) => {
          toast({ title: `Updated ${updated} task${updated !== 1 ? 's' : ''}`, description: `Priority set to ${priority}` })
          setSelectedIds(new Set())
        },
      }
    )
  }

  const handleBulkAssign = (assignedTo: string) => {
    bulkUpdate.mutate(
      { ids: [...selectedIds], update: { assignedTo }, updatedBy: user?.name },
      {
        onSuccess: ({ updated }) => {
          toast({ title: `Assigned ${updated} task${updated !== 1 ? 's' : ''}`, description: `Assigned to ${assignedTo}` })
          setSelectedIds(new Set())
        },
      }
    )
  }

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <>
      <Header
        title="All Tasks"
        subtitle={data ? `${data.total} tasks` : undefined}
        actions={
          isAuthenticated ? (
            <div className="flex items-center gap-2">
              <ExportButton tasks={allFiltered ?? []} />
              <Button size="sm" variant="outline" onClick={handlePrintPDF} title="Print / Save as PDF">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <Button size="sm" asChild>
                <Link to={ROUTES.TASK_NEW}>
                  <Plus className="h-4 w-4" />
                  New Task
                </Link>
              </Button>
            </div>
          ) : undefined
        }
      />
      <PageWrapper>
        <div className="space-y-4 max-w-[1400px]">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 rounded-lg border border-nwc-muted bg-white p-4 shadow-sm">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filters.requestSource} onValueChange={(v) => setFilter('requestSource', v as typeof filters.requestSource)}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Sources" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {REQUEST_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.serviceType} onValueChange={(v) => setFilter('serviceType', v as typeof filters.serviceType)}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Services" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICE_TYPES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilter('status', v as typeof filters.status)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(v) => setFilter('priority', v as typeof filters.priority)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Priorities" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {PRIORITY_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.assignedTo} onValueChange={(v) => setFilter('assignedTo', v)}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Assignees" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {ALL_ASSIGNEES.map((user) => <SelectItem key={user} value={user}>{user}</SelectItem>)}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => { setSearchValue(''); resetFilters() }} className="gap-1 text-slate-500">
                <X className="h-4 w-4" />
                Clear ({activeFilterCount})
              </Button>
            )}
          </div>

          <ActiveFiltersBar />

          {/* Bulk action bar */}
          {isAuthenticated && selectedCount > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-nwc-blue bg-nwc-light px-4 py-2.5 shadow-sm">
              <CheckSquare className="h-4 w-4 text-nwc-blue" />
              <span className="text-sm font-medium text-nwc-navy">{selectedCount} selected</span>
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7">
                      Set Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {STATUS_OPTIONS.map((s) => (
                      <DropdownMenuItem key={s.value} onClick={() => handleBulkStatus(s.value as TaskStatus)}>
                        {s.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7">
                      Set Priority
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {PRIORITY_OPTIONS.map((p) => (
                      <DropdownMenuItem key={p.value} onClick={() => handleBulkPriority(p.value as TaskPriority)}>
                        {p.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7">
                      Assign To
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-60 overflow-y-auto">
                    {ALL_ASSIGNEES.map((name) => (
                      <DropdownMenuItem key={name} onClick={() => handleBulkAssign(name)}>
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIds(new Set())}
                  className="h-7 text-slate-500"
                >
                  <SquareDashed className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          )}

          <TaskTable
            tasks={data?.data}
            loading={isLoading}
            filtered={activeFilterCount > 0}
            page={page}
            pageSize={PAGE_SIZE}
            total={data?.total ?? 0}
            onPageChange={setPage}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </div>
      </PageWrapper>
    </>
  )
}
