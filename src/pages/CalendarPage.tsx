import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameMonth, isToday,
} from 'date-fns'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAllTasks } from '@/hooks/useTasks'
import { taskDetailPath } from '@/constants/routes'
import { cn } from '@/lib/utils'
import type { Task } from '@/types/task'
import { DEFAULT_FILTERS } from '@/types/filters'

const STATUS_DOT: Record<string, string> = {
  new: 'bg-slate-400',
  in_progress: 'bg-amber-400',
  on_hold: 'bg-orange-400',
  blocked: 'bg-rose-500',
  completed: 'bg-green-500',
  cancelled: 'bg-slate-300',
}

function TaskDot({ task }: { task: Task }) {
  return (
    <Link
      to={taskDetailPath(task.id)}
      className={cn(
        'block truncate rounded px-1 py-0.5 text-[10px] font-medium text-white leading-tight',
        STATUS_DOT[task.status] ?? 'bg-slate-400'
      )}
      title={task.title}
    >
      {task.title}
    </Link>
  )
}

export function CalendarPage() {
  const [current, setCurrent] = useState(new Date())
  const { data: allTasks = [], isLoading } = useAllTasks(DEFAULT_FILTERS)

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const task of allTasks) {
      if (!task.dueDate) continue
      const key = task.dueDate.slice(0, 10)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(task)
    }
    return map
  }, [allTasks])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [current])

  const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <>
      <Header title="Calendar" subtitle="Tasks by due date" />
      <PageWrapper>
        <div className="max-w-[1200px] space-y-4">
          {/* Nav */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-nwc-navy">
              {format(current, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrent(subMonths(current, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrent(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrent(addMonths(current, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATUS_DOT).map(([s, c]) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={cn('h-2 w-2 rounded-full', c)} />
                <span className="text-xs text-slate-500 capitalize">{s.replace('_', ' ')}</span>
              </div>
            ))}
          </div>

          {isLoading ? (
            <Skeleton className="h-[600px] w-full rounded-xl" />
          ) : (
            <div className="rounded-xl border border-nwc-muted bg-white shadow-sm overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b bg-nwc-light">
                {WEEK_DAYS.map((d) => (
                  <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-nwc-navy">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {days.map((day, i) => {
                  const key = format(day, 'yyyy-MM-dd')
                  const dayTasks = tasksByDate.get(key) ?? []
                  const inMonth = isSameMonth(day, current)
                  const today = isToday(day)

                  return (
                    <div
                      key={i}
                      className={cn(
                        'min-h-[100px] border-b border-r p-1.5 last:border-r-0 transition-colors',
                        !inMonth && 'bg-slate-50/50',
                        today && 'bg-blue-50/40',
                        i % 7 === 6 && 'border-r-0'
                      )}
                    >
                      <div className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1',
                        today ? 'bg-nwc-blue text-white' : inMonth ? 'text-slate-700' : 'text-slate-300'
                      )}>
                        {format(day, 'd')}
                      </div>

                      <div className="space-y-0.5">
                        {dayTasks.slice(0, 3).map((task) => (
                          <TaskDot key={task.id} task={task} />
                        ))}
                        {dayTasks.length > 3 && (
                          <p className="text-[10px] text-slate-400 pl-1">+{dayTasks.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  )
}
