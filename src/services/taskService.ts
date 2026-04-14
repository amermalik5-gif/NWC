import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task'
import type { TaskFilters } from '@/types/filters'
import { mockTasks } from '@/data/mock/tasks'
import { applyFilters } from '@/lib/filterUtils'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

let localTasks: Task[] = [...mockTasks]

let nextId = localTasks.length + 1

function generateTaskId(): string {
  const id = `TASK-${String(nextId).padStart(3, '0')}`
  nextId++
  return id
}

export async function getTasks(
  filters: TaskFilters,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<Task>> {
  await new Promise((r) => setTimeout(r, 80))
  const filtered = applyFilters(localTasks, filters)
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
  await new Promise((r) => setTimeout(r, 80))
  const filtered = applyFilters(localTasks, filters)
  return [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getTaskById(id: string): Promise<Task | null> {
  await new Promise((r) => setTimeout(r, 50))
  return localTasks.find((t) => t.id === id) ?? null
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  await new Promise((r) => setTimeout(r, 100))
  const now = new Date().toISOString()
  const newTask: Task = {
    ...input,
    id: generateTaskId(),
    createdAt: now,
    updatedAt: now,
  }
  localTasks = [newTask, ...localTasks]
  return newTask
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  await new Promise((r) => setTimeout(r, 100))
  const idx = localTasks.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error(`Task ${id} not found`)
  const updated: Task = {
    ...localTasks[idx],
    ...input,
    updatedAt: new Date().toISOString(),
  }
  localTasks = localTasks.map((t) => (t.id === id ? updated : t))
  return updated
}

export async function deleteTask(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100))
  localTasks = localTasks.filter((t) => t.id !== id)
}
