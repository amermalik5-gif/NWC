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

const STORAGE_KEY = 'nwc-tasks'
const STORAGE_VERSION_KEY = 'nwc-tasks-version'
const CURRENT_VERSION = '2'

// Migrate persisted tasks from old schema to current schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateTask(t: any): Task {
  return {
    ...t,
    // serviceType (old singular) → serviceTypes (new array)
    serviceTypes: Array.isArray(t.serviceTypes)
      ? t.serviceTypes
      : t.serviceType
      ? [t.serviceType]
      : ['presentation_design'],
    // blocker field may be missing in old data
    blocker: t.blocker !== undefined ? t.blocker : null,
  }
}

function loadTasks(): Task[] {
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY)
    // If version doesn't match, wipe old data and load fresh mock tasks
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION)
      return [...mockTasks]
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as unknown[]
      return parsed.map(migrateTask)
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return [...mockTasks]
}

function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {}
}

let localTasks: Task[] = loadTasks()

// Derive next ID from the highest existing task number so we never collide
function generateTaskId(): string {
  const max = localTasks.reduce((acc, t) => {
    const n = parseInt(t.id.replace('TASK-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `TASK-${String(max + 1).padStart(3, '0')}`
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
  saveTasks(localTasks)
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
  saveTasks(localTasks)
  return updated
}

export async function deleteTask(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 100))
  localTasks = localTasks.filter((t) => t.id !== id)
  saveTasks(localTasks)
}
