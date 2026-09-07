import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TaskStatusBadge } from './TaskStatusBadge'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskActionMenu } from './TaskActionMenu'
import { BulkActionBar } from './BulkActionBar'
import { EmptyTasksState } from './EmptyTasksState'
import { formatDate } from '@/lib/formatters'
import { isOverdue } from '@/lib/dateHelpers'
import { taskDetailPath } from '@/constants/routes'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { useUpdateTask } from '@/hooks/useTaskMutations'
import { getTextDir } from '@/lib/textDir'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types/task'

type SortKey = 'id' | 'title' | 'status' | 'priority' | 'dueDate' | 'requestDate' | 'assignedTo'
type SortDir = 'asc' | 'desc'

interface TaskTableProps {
  tasks?: Task[]
  loading?: boolean
  filtered?: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

function SortButton({
  column, currentKey, dir, onClick, children,
}: {
  column: SortKey; currentKey: SortKey; dir: SortDir
  onClick: (key: SortKey) => void; children: React.ReactNode
}) {
  const active = column === currentKey
  return (
    <button
      className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
      onClick={() => onClick(column)}
    >
      {children}
      {active
        ? dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        : <ArrowUpDown className="h-3 w-3 opacity-40" />}
    </button>
  )
}

const STATUS_ORDER: TaskStatus[] = ['new', 'in_progress', 'on_hold', 'blocked', 'completed', 'cancelled']

function InlineStatusSelect({ task }: { task: Task }) {
  const update = useUpdateTask()
  const { STATUS_OPTIONS } = useConfigOptions()
  return (
    <Select
      value={task.status}
      onValueChange={(v) => update.mutate({ id: task.id, input: { status: v as TaskStatus } })}
    >
      <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0 shadow-none focus:ring-0 [&>svg]:ml-1 [&>svg]:h-3 [&>svg]:w-3">
        <TaskStatusBadge status={task.status} />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((s) => (
          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function TaskTable({
  tasks, loading, filtered, page, pageSize, total, onPageChange,
}: TaskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('requestDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const { SOURCE_LABEL, SERVICE_LABEL } = useConfigOptions()

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...(tasks ?? [])].sort((a, b) => {
    let av: string | number = ''
    let bv: string | number = ''
    switch (sortKey) {
      case 'id': av = a.id; bv = b.id; break
      case 'title': av = a.title.toLowerCase(); bv = b.title.toLowerCase(); break
      case 'status': av = STATUS_ORDER.indexOf(a.status); bv = STATUS_ORDER.indexOf(b.status); break
      case 'priority': { const o = { low: 1, medium: 2, high: 3, urgent: 4 }; av = o[a.priority]; bv = o[b.priority]; break }
      case 'dueDate': av = a.dueDate; bv = b.dueDate; break
      case 'requestDate': av = a.requestDate; bv = b.requestDate; break
      case 'assignedTo': av = a.assignedTo.toLowerCase(); bv = b.assignedTo.toLowerCase(); break
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(total / pageSize)
  const allChecked = sorted.length > 0 && sorted.every((t) => selectedIds.includes(t.id))
  const toggleAll = () => setSelectedIds(allChecked ? [] : sorted.map((t) => t.id))
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <>
      <Card>
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyTasksState filtered={filtered} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-3 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <SortButton column="id" currentKey={sortKey} dir={sortDir} onClick={handleSort}>ID</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <SortButton column="title" currentKey={sortKey} dir={sortDir} onClick={handleSort}>Title</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</span>
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <SortButton column="status" currentKey={sortKey} dir={sortDir} onClick={handleSort}>Status</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <SortButton column="priority" currentKey={sortKey} dir={sortDir} onClick={handleSort}>Priority</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">
                      <SortButton column="assignedTo" currentKey={sortKey} dir={sortDir} onClick={handleSort}>Assigned</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left hidden xl:table-cell">
                      <SortButton column="requestDate" currentKey={sortKey} dir={sortDir} onClick={handleSort}>Requested</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <SortButton column="dueDate" currentKey={sortKey} dir={sortDir} onClick={handleSort}>Due</SortButton>
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((task) => {
                    const checked = selectedIds.includes(task.id)
                    return (
                      <tr
                        key={task.id}
                        className={cn(
                          'border-b last:border-0 hover:bg-slate-50 transition-colors',
                          isOverdue(task) && 'bg-red-50/30 hover:bg-red-50/60',
                          checked && 'bg-blue-50/50 hover:bg-blue-50/70'
                        )}
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOne(task.id)}
                            className="rounded border-slate-300 text-blue-600 cursor-pointer"
                            aria-label={`Select ${task.id}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={taskDetailPath(task.id)}
                            className="text-xs font-mono font-semibold text-blue-600 hover:underline whitespace-nowrap"
                          >
                            {task.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 max-w-[220px]">
                          <Link
                            to={taskDetailPath(task.id)}
                            className="font-medium text-slate-700 hover:text-blue-600 transition-colors line-clamp-1"
                            dir={getTextDir(task.title)}
                          >
                            {task.title}
                          </Link>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.requesterName}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-slate-500 whitespace-nowrap">{SOURCE_LABEL[task.requestSource]}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-slate-500 line-clamp-1 max-w-[140px]">
                            {task.serviceTypes?.map((s) => SERVICE_LABEL[s] ?? s).join(', ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <InlineStatusSelect task={task} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <TaskPriorityBadge priority={task.priority} />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-slate-600 whitespace-nowrap">{task.assignedTo.split(' ')[0]}</span>
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(task.requestDate)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={cn(
                            'text-xs font-medium',
                            isOverdue(task) ? 'text-red-600' : 'text-slate-500'
                          )}>
                            {formatDate(task.dueDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <TaskActionMenu task={task} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} tasks
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="h-8">
                    Previous
                  </Button>
                  <span className="text-xs text-slate-500">{page} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="h-8">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Floating bulk action bar */}
      <BulkActionBar
        selectedIds={selectedIds}
        tasks={tasks ?? []}
        onClear={() => setSelectedIds([])}
      />
    </>
  )
}
