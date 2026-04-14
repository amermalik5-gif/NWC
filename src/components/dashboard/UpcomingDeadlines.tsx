import { Link } from 'react-router-dom'
import { CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { formatShortDate } from '@/lib/formatters'
import { getDaysUntilDue, isDueSoon } from '@/lib/dateHelpers'
import { taskDetailPath } from '@/constants/routes'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

interface UpcomingDeadlinesProps {
  tasks?: Task[]
  loading?: boolean
}

export function UpcomingDeadlines({ tasks, loading }: UpcomingDeadlinesProps) {
  const upcoming = tasks
    ?.filter((t) => isDueSoon(t, 7))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 8)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-700">
          <CalendarClock className="h-4 w-4 text-amber-500" />
          Due in 7 Days
          {!loading && upcoming && (
            <span className="ml-auto text-xs font-normal text-slate-400">
              {upcoming.length} task{upcoming.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : upcoming?.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No tasks due in the next 7 days</p>
        ) : (
          <div className="space-y-2">
            {upcoming?.map((task) => {
              const days = getDaysUntilDue(task.dueDate)
              return (
                <Link
                  key={task.id}
                  to={taskDetailPath(task.id)}
                  className="flex items-start gap-3 rounded-md p-2 hover:bg-slate-50 transition-colors"
                >
                  <div className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                    days === 0 ? 'bg-red-100 text-red-700' :
                    days <= 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    {days === 0 ? 'Today' : `${days}d`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{task.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-slate-400">{formatShortDate(task.dueDate)}</span>
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
