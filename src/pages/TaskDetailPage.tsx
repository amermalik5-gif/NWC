import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel'
import { PageLoader } from '@/components/common/LoadingSpinner'
import { useTask } from '@/hooks/useTask'
import { ROUTES } from '@/constants/routes'

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: task, isLoading, isError } = useTask(id)

  if (isLoading) {
    return (
      <>
        <Header title="Task Details" />
        <PageWrapper><PageLoader /></PageWrapper>
      </>
    )
  }

  if (isError || !task) {
    return (
      <>
        <Header title="Task not found" />
        <PageWrapper>
          <div className="flex flex-col items-center py-16 gap-4">
            <p className="text-slate-500">Task {id} could not be found.</p>
            <Button variant="outline" asChild>
              <Link to={ROUTES.TASKS}><ArrowLeft className="h-4 w-4" />Back to tasks</Link>
            </Button>
          </div>
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <Header
        title={task.id}
        subtitle={task.title}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.TASKS}><ArrowLeft className="h-4 w-4" />All Tasks</Link>
          </Button>
        }
      />
      <PageWrapper>
        <div className="max-w-4xl">
          <TaskDetailPanel task={task} />
        </div>
      </PageWrapper>
    </>
  )
}
