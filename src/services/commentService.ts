import type { TaskComment, ActivityEntry } from '@/types/task'

const API = '/api'

export async function getComments(taskId: string): Promise<TaskComment[]> {
  const res = await fetch(`${API}/tasks/${taskId}/comments`)
  if (!res.ok) throw new Error('Failed to load comments')
  return res.json()
}

export async function addComment(
  taskId: string,
  body: string,
  authorName: string,
  authorId: string
): Promise<TaskComment> {
  const res = await fetch(`${API}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, authorName, authorId }),
  })
  if (!res.ok) throw new Error('Failed to add comment')
  return res.json()
}

export async function deleteComment(taskId: string, commentId: string): Promise<void> {
  await fetch(`${API}/tasks/${taskId}/comments/${commentId}`, { method: 'DELETE' })
}

export async function getActivity(taskId: string): Promise<ActivityEntry[]> {
  const res = await fetch(`${API}/tasks/${taskId}/activity`)
  if (!res.ok) throw new Error('Failed to load activity')
  return res.json()
}
