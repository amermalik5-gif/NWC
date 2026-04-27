import { createBrowserRouter } from 'react-router-dom'

// Main app
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TaskListPage } from '@/pages/TaskListPage'
import { TaskDetailPage } from '@/pages/TaskDetailPage'
import { TaskCreatePage } from '@/pages/TaskCreatePage'
import { TaskEditPage } from '@/pages/TaskEditPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedAppRoute } from '@/components/auth/ProtectedAppRoute'
import { ROUTES } from '@/constants/routes'

// Admin module
import { AdminShell } from '@/admin/components/layout/AdminShell'
import { ProtectedAdminRoute } from '@/admin/auth/ProtectedAdminRoute'
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage'
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage'
import { UsersPage } from '@/admin/pages/UsersPage'
import { AdminTasksPage } from '@/admin/pages/AdminTasksPage'
import { SourcesPage } from '@/admin/pages/SourcesPage'
import { ServicesPage } from '@/admin/pages/ServicesPage'
import { StatusesPage } from '@/admin/pages/StatusesPage'
import { PrioritiesPage } from '@/admin/pages/PrioritiesPage'
import { DashboardControlPage } from '@/admin/pages/DashboardControlPage'
import { SettingsPage } from '@/admin/pages/SettingsPage'

export const router = createBrowserRouter([
  // ── Main app — public login ──────────────────────────────────────────────────
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ── Main application (public) ────────────────────────────────────────────────
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.TASKS, element: <TaskListPage /> },
      { path: ROUTES.TASK_NEW, element: <ProtectedAppRoute><TaskCreatePage /></ProtectedAppRoute> },
      { path: ROUTES.TASK_DETAIL, element: <TaskDetailPage /> },
      { path: ROUTES.TASK_EDIT, element: <ProtectedAppRoute><TaskEditPage /></ProtectedAppRoute> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Admin — public ───────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // ── Admin — protected (requires auth) ────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedAdminRoute>
        <AdminShell />
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'tasks', element: <AdminTasksPage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'statuses', element: <StatusesPage /> },
      { path: 'priorities', element: <PrioritiesPage /> },
      { path: 'dashboard-control', element: <DashboardControlPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
