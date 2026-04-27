import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'
import type { TaskFilters } from '@/types/filters'
import { applyFilters } from '@/lib/filterUtils'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

const API = '/api'

async function fetchAllTasks(): Promise<Task[]> {
  const res = await fetch(`${API}/tasks`)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function getTasks(
  filters: TaskFilters,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Task>> {
  const allTasks = await fetchAllTasks()
  const filtered = applyFilters(allTasks, filters)
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const start = (page - 1) * pageSize
  return {
    data: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  }
}

export async function getAllTasks(filters: TaskFilters): Promise<Task[]> {
  const allTasks = await fetchAllTasks()
  return [...applyFilters(allTasks, filters)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getTaskById(id: string): Promise<Task | null> {
  const res = await fetch(`${API}/tasks/${id}`)
  if (!res.ok) return null
  return res.json()
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

export async function deleteTask(id: string): Promise<void> {
  await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
}
