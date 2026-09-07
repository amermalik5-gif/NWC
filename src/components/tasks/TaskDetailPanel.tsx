import { Link } from 'react-router-dom'
import { Pencil, CalendarDays, Building2, StickyNote, Ban, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TaskStatusBadge } from './TaskStatusBadge'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskComments } from './TaskComments'
import { formatDate } from '@/lib/formatters'
import { isOverdue } from '@/lib/dateHelpers'
import { taskEditPath } from '@/constants/routes'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { useUpdateTask } from '@/hooks/useTaskMutations'
import { getTextDir } from '@/lib/textDir'
import type { Task, TaskStatus } from '@/types/task'

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
  const { SOURCE_LABEL, SERVICE_LABEL, STATUS_OPTIONS } = useConfigOptions()
  const update = useUpdateTask()
  const titleDir = getTextDir(task.title)
  const descDir = getTextDir(task.description)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-blue-600">{task.id}</span>
            {overdue && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                Overdue
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900" dir={titleDir}>{task.title}</h2>
          {task.description && (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed" dir={descDir}>{task.description}</p>
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

      {/* Inline status + priority */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</span>
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
        </div>
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
            <DetailRow
              label="Service(s)"
              value={
                task.serviceTypes?.length
                  ? task.serviceTypes.map((s) => SERVICE_LABEL[s] ?? s).join(', ')
                  : '—'
              }
            />
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

      {/* Blocker */}
      {task.status === 'blocked' && task.blocker && (
        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-rose-700">
              <Ban className="h-4 w-4" />
              Blocked — Reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-rose-800 whitespace-pre-wrap leading-relaxed"
               dir={getTextDir(task.blocker)}>{task.blocker}</p>
          </CardContent>
        </Card>
      )}

      {/* Drive link */}
      {task.driveLink && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
              <ExternalLink className="h-4 w-4" />
              Reference Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={task.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Drive folder
            </a>
          </CardContent>
        </Card>
      )}

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
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed"
               dir={getTextDir(task.notes)}>{task.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Comments & Activity */}
      <TaskComments task={task} />

      {/* Metadata */}
      <div className="text-xs text-slate-400 space-y-0.5">
        <p>Created: {formatDate(task.createdAt, 'MMM d, yyyy HH:mm')}</p>
        <p>Last updated: {formatDate(task.updatedAt, 'MMM d, yyyy HH:mm')}</p>
      </div>
    </div>
  )
}
