import { useMemo } from 'react'
import { Users, ListChecks, Timer, AlertCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { useAllTasks } from '@/hooks/useTasks'
import { taskDetailPath } from '@/constants/routes'
import { isOverdue } from '@/lib/dateHelpers'
import { TaskPriorityBadge } from '@/components/tasks/TaskPriorityBadge'
import { cn } from '@/lib/utils'
import { DEFAULT_FILTERS } from '@/types/filters'
import type { Task } from '@/types/task'

interface AssigneeStat {
  name: string
  total: number
  open: number
  inProgress: number
  completed: number
  overdue: number
  tasks: Task[]
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-slate-400',
  in_progress: 'bg-amber-400',
  on_hold: 'bg-orange-400',
  blocked: 'bg-rose-500',
  completed: 'bg-green-500',
  cancelled: 'bg-slate-300',
}

function WorkloadBar({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  if (total === 0) return <div className="h-2 rounded-full bg-slate-100 w-full" />

  const groups: Record<string, number> = {}
  tasks.forEach((t) => { groups[t.status] = (groups[t.status] ?? 0) + 1 })

  return (
    <div className="flex h-2 w-full rounded-full overflow-hidden gap-px">
      {Object.entries(groups).map(([status, count]) => (
        <div
          key={status}
          className={cn('h-full', STATUS_COLORS[status] ?? 'bg-slate-300')}
          style={{ width: `${(count / total) * 100}%` }}
          title={`${status.replace('_', ' ')}: ${count}`}
        />
      ))}
    </div>
  )
}

export function WorkloadPage() {
  const { data: allTasks = [], isLoading } = useAllTasks(DEFAULT_FILTERS)

  const stats: AssigneeStat[] = useMemo(() => {
    const map = new Map<string, AssigneeStat>()
    for (const task of allTasks) {
      const name = task.assignedTo || 'Unassigned'
      if (!map.has(name)) {
        map.set(name, { name, total: 0, open: 0, inProgress: 0, completed: 0, overdue: 0, tasks: [] })
      }
      const s = map.get(name)!
      s.total++
      s.tasks.push(task)
      if (task.status === 'new') s.open++
      if (task.status === 'in_progress') s.inProgress++
      if (task.status === 'completed') s.completed++
      if (isOverdue(task)) s.overdue++
    }
    return [...map.values()].sort((a, b) => b.total - a.total)
  }, [allTasks])

  const maxTotal = Math.max(...stats.map((s) => s.total), 1)

  return (
    <>
      <Header
        title="Workload"
        subtitle="Task distribution across team members"
      />
      <PageWrapper>
        <div className="space-y-6 max-w-[1200px]">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="border-nwc-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nwc-light">
                  <Users className="h-5 w-5 text-nwc-blue" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Team Members</p>
                  <p className="text-2xl font-bold text-nwc-navy">{stats.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-nwc-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <ListChecks className="h-5 w-5 text-nwc-blue" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-nwc-navy">{allTasks.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-nwc-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Timer className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">In Progress</p>
                  <p className="text-2xl font-bold text-nwc-navy">{allTasks.filter(t => t.status === 'in_progress').length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-nwc-muted">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{allTasks.filter(t => isOverdue(t)).length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workload bars */}
          <Card className="border-nwc-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-nwc-blue" />
                Team Workload Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : stats.map((s) => (
                <div key={s.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-nwc-blue text-white text-xs font-bold">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="text-amber-600 font-medium">{s.inProgress} active</span>
                      {s.overdue > 0 && <span className="text-red-600 font-medium">{s.overdue} overdue</span>}
                      <span>{s.completed}/{s.total} done</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <WorkloadBar tasks={s.tasks} />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{s.total}</span>
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex flex-wrap gap-3 pt-2 border-t mt-4">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div className={cn('h-2.5 w-2.5 rounded-full', color)} />
                    <span className="text-xs text-slate-500 capitalize">{status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Per-person task list */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {stats.map((s) => {
              const activeTasks = s.tasks.filter(t => !['completed', 'cancelled'].includes(t.status))
              if (activeTasks.length === 0) return null
              return (
                <Card key={s.name} className="border-nwc-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-nwc-blue text-white text-xs font-bold">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-800">{s.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">{activeTasks.length} open</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    {activeTasks.slice(0, 5).map((task) => (
                      <Link
                        key={task.id}
                        to={taskDetailPath(task.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors',
                          isOverdue(task) && 'bg-red-50/40'
                        )}
                      >
                        <span className="text-xs font-mono text-nwc-blue w-20 shrink-0">{task.id}</span>
                        <span className="text-xs text-slate-700 flex-1 truncate">{task.title}</span>
                        <TaskPriorityBadge priority={task.priority} />
                      </Link>
                    ))}
                    {activeTasks.length > 5 && (
                      <p className="text-xs text-slate-400 text-center pt-1">+{activeTasks.length - 5} more</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
