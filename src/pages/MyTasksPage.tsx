import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TaskTable } from '@/components/tasks/TaskTable'
import { ExportButton } from '@/components/common/ExportButton'
import { useTasks, useAllTasks } from '@/hooks/useTasks'
import { useUserAuthStore } from '@/store/userAuthStore'
import { ROUTES } from '@/constants/routes'
import type { TaskFilters } from '@/types/filters'
import { DEFAULT_FILTERS } from '@/types/filters'

export function MyTasksPage() {
  const { user } = useUserAuthStore()
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const myFilters: TaskFilters = {
    ...DEFAULT_FILTERS,
    assignedTo: user?.name ?? '',
  }

  const { data, isLoading } = useTasks(myFilters, page, PAGE_SIZE)
  const { data: allFiltered } = useAllTasks(myFilters)

  useEffect(() => { setPage(1) }, [user?.name])

  return (
    <>
      <Header
        title="My Tasks"
        subtitle={user ? `Assigned to ${user.name}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton tasks={allFiltered ?? []} filename="my-tasks.csv" />
            <Button size="sm" asChild>
              <Link to={ROUTES.TASK_NEW}>
                <Plus className="h-4 w-4" />
                New Task
              </Link>
            </Button>
          </div>
        }
      />
      <PageWrapper>
        <div className="space-y-4 max-w-[1400px]">
          {data?.total === 0 && !isLoading ? (
            <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
              <UserCircle className="h-12 w-12" />
              <p className="text-base font-medium">No tasks assigned to you</p>
              <p className="text-sm">Create a task or ask an admin to assign one to you.</p>
              <Button size="sm" variant="outline" asChild>
                <Link to={ROUTES.TASK_NEW}><Plus className="h-4 w-4" />Create Task</Link>
              </Button>
            </div>
          ) : (
            <TaskTable
              tasks={data?.data}
              loading={isLoading}
              filtered={false}
              page={page}
              pageSize={PAGE_SIZE}
              total={data?.total ?? 0}
              onPageChange={setPage}
            />
          )}
        </div>
      </PageWrapper>
    </>
  )
}
