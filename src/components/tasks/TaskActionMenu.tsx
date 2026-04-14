import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDeleteTask } from '@/hooks/useTaskMutations'
import { useToast } from '@/hooks/useToast'
import { taskDetailPath, taskEditPath } from '@/constants/routes'
import type { Task } from '@/types/task'

interface TaskActionMenuProps {
  task: Task
}

export function TaskActionMenu({ task }: TaskActionMenuProps) {
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: deleteTask, isPending } = useDeleteTask()
  const { toast } = useToast()

  const handleDelete = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        toast({ title: 'Task deleted', description: `${task.id} has been removed.` })
        setDeleteOpen(false)
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to delete task.', variant: 'destructive' })
      },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(taskDetailPath(task.id))}>
            <ExternalLink className="h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(taskEditPath(task.id))}>
            <Pencil className="h-4 w-4" />
            Edit task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete task?"
        description={`This will permanently delete "${task.title}" (${task.id}). This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isPending}
      />
    </>
  )
}
