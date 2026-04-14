import { useState } from 'react'
import { Search, Trash2, RefreshCw, X, CheckSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAllTasks } from '@/hooks/useTasks'
import { useUpdateTask, useDeleteTask } from '@/hooks/useTaskMutations'
import { useToast } from '@/hooks/useToast'
import { DEFAULT_FILTERS } from '@/types/filters'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { formatDate } from '@/lib/formatters'
import { isOverdue } from '@/lib/dateHelpers'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus, TaskPriority } from '@/types/task'

export function AdminTasksPage() {
  const { data: tasks = [], isLoading } = useAllTasks(DEFAULT_FILTERS)
  const { mutate: updateTask } = useUpdateTask()
  const { mutate: deleteTask } = useDeleteTask()
  const { toast } = useToast()
  const { SOURCE_LABEL, SERVICE_LABEL, REQUEST_SOURCES, SERVICE_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS, ALL_ASSIGNEES } = useConfigOptions()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set())
  // Bulk dialog
  const [bulkAction, setBulkAction] = useState<'status' | 'priority' | 'assign' | null>(null)
  const [bulkValue, setBulkValue] = useState('')
  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = !search || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchSource = sourceFilter === 'all' || t.requestSource === sourceFilter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchSearch && matchStatus && matchSource && matchPriority
  })

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((t) => t.id)))
    }
  }

  const handleBulkApply = () => {
    if (!bulkAction || !bulkValue) return
    let count = 0
    selected.forEach((id) => {
      updateTask({ id, input: { [bulkAction === 'assign' ? 'assignedTo' : bulkAction]: bulkValue } })
      count++
    })
    toast({ title: 'Bulk update applied', description: `${count} tasks updated.` })
    setSelected(new Set())
    setBulkAction(null)
    setBulkValue('')
  }

  const handleBulkDelete = () => {
    selected.forEach((id) => deleteTask(id))
    toast({ title: 'Tasks deleted', description: `${selected.size} tasks removed.` })
    setSelected(new Set())
    setBulkDeleteOpen(false)
  }

  return (
    <>
      <AdminHeader
        title="Task Management"
        subtitle={`${tasks.length} total tasks`}
        actions={
          selected.size > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">{selected.size} selected</span>
              <Button size="sm" variant="outline" onClick={() => setBulkAction('status')}>Set Status</Button>
              <Button size="sm" variant="outline" onClick={() => setBulkAction('priority')}>Set Priority</Button>
              <Button size="sm" variant="outline" onClick={() => setBulkAction('assign')}>Reassign</Button>
              <Button size="sm" variant="destructive" onClick={() => setBulkDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" />Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null
        }
      />
      <AdminPageWrapper>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-4 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Sources" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {REQUEST_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Priorities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {PRIORITY_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
            <CheckSquare className="h-4 w-4" />
            <strong>{selected.size}</strong> tasks selected —
            <button className="underline hover:no-underline" onClick={() => setSelected(new Set(filtered.map((t) => t.id)))}>
              Select all {filtered.length}
            </button>
            <span>·</span>
            <button className="underline hover:no-underline" onClick={() => setSelected(new Set())}>Clear selection</button>
          </div>
        )}

        <Card>
          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading tasks…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="w-8 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="rounded"
                      />
                    </th>
                    {['ID', 'Title', 'Source', 'Service', 'Status', 'Priority', 'Assigned To', 'Due', 'Actions'].map((h) => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((task) => (
                    <tr
                      key={task.id}
                      className={cn(
                        'border-b last:border-0 transition-colors',
                        selected.has(task.id) ? 'bg-blue-50' : 'hover:bg-slate-50',
                        isOverdue(task) && !selected.has(task.id) && 'bg-red-50/30'
                      )}
                    >
                      <td className="w-8 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(task.id)}
                          onChange={() => toggleSelect(task.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-3 text-xs font-mono font-semibold text-slate-500">{task.id}</td>
                      <td className="px-3 py-3 max-w-[200px]">
                        <p className="font-medium text-slate-700 truncate">{task.title}</p>
                        <p className="text-xs text-slate-400 truncate">{task.requesterName}</p>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{SOURCE_LABEL[task.requestSource]}</td>
                      <td className="px-3 py-3 text-xs text-slate-500 max-w-[130px] truncate">{SERVICE_LABEL[task.serviceType]}</td>
                      <td className="px-3 py-3 whitespace-nowrap"><TaskStatusBadge status={task.status} /></td>
                      <td className="px-3 py-3 whitespace-nowrap"><TaskPriorityBadge priority={task.priority} /></td>
                      <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{task.assignedTo.split(' ')[0]}</td>
                      <td className={cn('px-3 py-3 text-xs whitespace-nowrap', isOverdue(task) ? 'text-red-600 font-medium' : 'text-slate-500')}>
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="px-3 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setDeleteTarget(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t px-4 py-2 text-xs text-slate-400">
            Showing {filtered.length} of {tasks.length} tasks
          </div>
        </Card>
      </AdminPageWrapper>

      {/* Bulk action dialog */}
      <Dialog open={!!bulkAction} onOpenChange={(open) => !open && setBulkAction(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {bulkAction === 'status' ? 'Set Status' :
               bulkAction === 'priority' ? 'Set Priority' : 'Reassign'}
              {' '}for {selected.size} tasks
            </DialogTitle>
            <DialogDescription>This will update all selected tasks.</DialogDescription>
          </DialogHeader>
          <div>
            <Label>New Value</Label>
            <Select value={bulkValue} onValueChange={setBulkValue}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                {bulkAction === 'status' && STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                {bulkAction === 'priority' && PRIORITY_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                {bulkAction === 'assign' && ALL_ASSIGNEES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAction(null)}>Cancel</Button>
            <Button onClick={handleBulkApply} disabled={!bulkValue} className="bg-red-600 hover:bg-red-700">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete task?"
        description={`Task ${deleteTarget} will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) deleteTask(deleteTarget)
          setDeleteTarget(null)
          toast({ title: 'Task deleted' })
        }}
      />

      {/* Bulk delete */}
      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selected.size} tasks?`}
        description="This action cannot be undone. All selected tasks will be permanently removed."
        confirmLabel={`Delete ${selected.size} tasks`}
        onConfirm={handleBulkDelete}
      />
    </>
  )
}
