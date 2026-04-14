import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TaskForm } from '@/components/tasks/TaskForm'

export function TaskCreatePage() {
  return (
    <>
      <Header title="New Task" subtitle="Create a new task request" />
      <PageWrapper>
        <div className="max-w-3xl">
          <TaskForm mode="create" />
        </div>
      </PageWrapper>
    </>
  )
}
