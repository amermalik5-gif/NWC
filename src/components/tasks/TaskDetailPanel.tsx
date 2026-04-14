import { Link } from 'react-router-dom'
import { Pencil, CalendarDays, User, Tag, Briefcase, Building2, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TaskStatusBadge } from './TaskStatusBadge'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { formatDate } from '@/lib/formatters'
import { isOverdue } from '@/lib/dateHelpers'
import { taskEditPath } from '@/constants/routes'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import type { Task } from '@/types/task'

interface TaskDetailPanelProps {
  task: Task
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-36 shrink-0 text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-slate-700">{value ?? '—'}</span>
    </div>
  )
}

export function TaskDetailPanel({ task }: TaskDetailPanelProps) {
  const overdue = isOverdue(task)
  const { SOURCE_LABEL, SERVICE_LABEL } = useConfigOptions()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-blue-600">{task.id}</span>
            {overdue && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                Overdue
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
          {task.description && (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{task.description}</p>
          )}
        </div>
        <Button size="sm" variant="outline" asChild className="shrink-0">
          <Link to={taskEditPath(task.id)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Status & Priority */}
      <div className="flex flex-wrap gap-3">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow label="Source" value={SOURCE_LABEL[task.requestSource]} />
            <DetailRow label="Service" value={SERVICE_LABEL[task.serviceType]} />
            <DetailRow label="Requester" value={task.requesterName} />
            <DetailRow label="Assigned To" value={task.assignedTo} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailRow label="Requested" value={formatDate(task.requestDate)} />
            <DetailRow label="Start Date" value={formatDate(task.startDate)} />
            <DetailRow
              label="Due Date"
              value={
                <span className={overdue ? 'font-medium text-red-600' : undefined}>
                  {formatDate(task.dueDate)}
                </span>
              }
            />
            <DetailRow label="Completed" value={formatDate(task.completionDate)} />
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {task.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
              <StickyNote className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{task.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-xs text-slate-400 space-y-0.5">
        <p>Created: {formatDate(task.createdAt, 'MMM d, yyyy HH:mm')}</p>
        <p>Last updated: {formatDate(task.updatedAt, 'MMM d, yyyy HH:mm')}</p>
      </div>
    </div>
  )
}
