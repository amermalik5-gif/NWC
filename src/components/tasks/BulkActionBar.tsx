import { useState } from 'react'
import { X, CheckSquare, UserCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useUpdateTask, useDeleteTask } from '@/hooks/useTaskMutations'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { useToast } from '@/hooks/useToast'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { Task } from '@/types/task'

interface BulkActionBarProps {
  selectedIds: string[]
  tasks: Task[]
  onClear: () => void
}

export function BulkActionBar({ selectedIds, tasks, onClear }: BulkActionBarProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const { STATUS_OPTIONS, ALL_ASSIGNEES } = useConfigOptions()
  const { toast } = useToast()

  if (selectedIds.length === 0) return null

  async function bulkStatus(status: string) {
    for (const id of selectedIds) {
      await updateTask.mutateAsync({ id, input: { status: status as Task['status'] } })
    }
    toast({ title: `Updated ${selectedIds.length} tasks`, description: `Status set to ${status}` })
    onClear()
  }

  async function bulkAssign(name: string) {
    for (const id of selectedIds) {
      await updateTask.mutateAsync({ id, input: { assignedTo: name } })
    }
    toast({ title: `Reassigned ${selectedIds.length} tasks`, description: `Now assigned to ${name}` })
    onClear()
  }

  async function bulkDelete() {
    for (const id of selectedIds) {
      await deleteTask.mutateAsync(id)
    }
    toast({ title: `Deleted ${selectedIds.length} tasks` })
    onClear()
    setDeleteOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl border bg-slate-900 px-4 py-3 shadow-2xl text-white">
        <span className="text-sm font-medium text-slate-300 mr-2">
          <CheckSquare className="inline h-4 w-4 mr-1 text-blue-400" />
          {selectedIds.length} selected
        </span>

        <Select onValueChange={bulkStatus}>
          <SelectTrigger className="h-8 w-36 bg-slate-800 border-slate-700 text-white text-xs">
            <SelectValue placeholder="Set status…" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={bulkAssign}>
          <SelectTrigger className="h-8 w-40 bg-slate-800 border-slate-700 text-white text-xs">
            <SelectValue placeholder="Reassign to…" />
          </SelectTrigger>
          <SelectContent>
            {ALL_ASSIGNEES.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-red-400 hover:text-red-300 hover:bg-slate-800"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <button
          onClick={onClear}
          className="ml-1 rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${selectedIds.length} tasks?`}
        description="This cannot be undone. All selected tasks will be permanently removed."
        confirmLabel="Delete all"
        onConfirm={bulkDelete}
        variant="destructive"
      />
    </>
  )
}
