import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TaskForm } from '@/components/tasks/TaskForm'
import { PageLoader } from '@/components/common/LoadingSpinner'
import { useTask } from '@/hooks/useTask'
import { taskDetailPath } from '@/constants/routes'

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>()
  const { data: task, isLoading } = useTask(id)

  if (isLoading) {
    return (
      <>
        <Header title="Edit Task" />
        <PageWrapper><PageLoader /></PageWrapper>
      </>
    )
  }

  if (!task) {
    return (
      <>
        <Header title="Task not found" />
        <PageWrapper><p className="text-slate-500">Task {id} could not be found.</p></PageWrapper>
      </>
    )
  }

  return (
    <>
      <Header
        title="Edit Task"
        subtitle={task.title}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to={taskDetailPath(task.id)}><ArrowLeft className="h-4 w-4" />View details</Link>
          </Button>
        }
      />
      <PageWrapper>
        <div className="max-w-3xl">
          <TaskForm
            mode="edit"
            taskId={task.id}
            defaultValues={{
              title: task.title,
              description: task.description,
              requestSource: task.requestSource,
              serviceType: task.serviceType,
              requesterName: task.requesterName,
              assignedTo: task.assignedTo,
              status: task.status,
              priority: task.priority,
              requestDate: task.requestDate,
              startDate: task.startDate,
              dueDate: task.dueDate,
              completionDate: task.completionDate,
              notes: task.notes,
              attachments: task.attachments,
            }}
          />
        </div>
      </PageWrapper>
    </>
  )
}
