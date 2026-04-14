import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge'
import { formatDate } from '@/lib/formatters'
import { isOverdue } from '@/lib/dateHelpers'
import { taskDetailPath, ROUTES } from '@/constants/routes'
import { SOURCE_LABEL } from '@/constants/taskConstants'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'

interface RecentTasksTableProps {
  tasks?: Task[]
  loading?: boolean
}

export function RecentTasksTable({ tasks, loading }: RecentTasksTableProps) {
  const recent = tasks?.slice(0, 10)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">Recent Tasks</CardTitle>
        <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-blue-600 hover:text-blue-700">
          <Link to={ROUTES.TASKS}>
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Source</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Priority</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Assigned</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Due</th>
                </tr>
              </thead>
              <tbody>
                {recent?.map((task) => (
                  <tr
                    key={task.id}
                    className={cn(
                      'border-b last:border-0 hover:bg-slate-50 transition-colors',
                      isOverdue(task) && 'bg-red-50/40 hover:bg-red-50'
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        to={taskDetailPath(task.id)}
                        className="text-xs font-mono font-semibold text-blue-600 hover:underline"
                      >
                        {task.id}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        to={taskDetailPath(task.id)}
                        className="font-medium text-slate-700 hover:text-blue-600 transition-colors line-clamp-1 max-w-[200px]"
                      >
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell text-slate-500 text-xs whitespace-nowrap">
                      {SOURCE_LABEL[task.requestSource]}
                    </td>
                    <td className="px-4 py-2.5">
                      <TaskStatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      <TaskPriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                      {task.assignedTo.split(' ')[0]}
                    </td>
                    <td className={cn(
                      'px-4 py-2.5 hidden xl:table-cell text-xs whitespace-nowrap',
                      isOverdue(task) ? 'text-red-600 font-medium' : 'text-slate-500'
                    )}>
                      {formatDate(task.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
