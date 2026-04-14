import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { TaskListPage } from '@/pages/TaskListPage'
import { TaskDetailPage } from '@/pages/TaskDetailPage'
import { TaskCreatePage } from '@/pages/TaskCreatePage'
import { TaskEditPage } from '@/pages/TaskEditPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ROUTES } from '@/constants/routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.TASKS, element: <TaskListPage /> },
      { path: ROUTES.TASK_NEW, element: <TaskCreatePage /> },
      { path: ROUTES.TASK_DETAIL, element: <TaskDetailPage /> },
      { path: ROUTES.TASK_EDIT, element: <TaskEditPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
