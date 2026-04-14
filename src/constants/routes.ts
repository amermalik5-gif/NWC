export const ROUTES = {
  DASHBOARD: '/',
  TASKS: '/tasks',
  TASK_NEW: '/tasks/new',
  TASK_DETAIL: '/tasks/:id',
  TASK_EDIT: '/tasks/:id/edit',
} as const

export function taskDetailPath(id: string) {
  return `/tasks/${id}`
}

export function taskEditPath(id: string) {
  return `/tasks/${id}/edit`
}
