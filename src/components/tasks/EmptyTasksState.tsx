import { Link } from 'react-router-dom'
import { ClipboardList, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

interface EmptyTasksStateProps {
  filtered?: boolean
}

export function EmptyTasksState({ filtered }: EmptyTasksStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <ClipboardList className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-700">
        {filtered ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {filtered
          ? 'Try adjusting or clearing your filters to see more tasks.'
          : 'Create your first task to get started.'}
      </p>
      {!filtered && (
        <Button className="mt-4" asChild>
          <Link to={ROUTES.TASK_NEW}>
            <Plus className="h-4 w-4" />
            New Task
          </Link>
        </Button>
      )}
    </div>
  )
}
