import { parseISO, isBefore, differenceInDays, startOfDay } from 'date-fns'
import type { Task } from '@/types/task'

export function isOverdue(task: Task): boolean {
  if (task.status === 'completed' || task.status === 'cancelled') return false
  const today = startOfDay(new Date())
  const due = startOfDay(parseISO(task.dueDate))
  return isBefore(due, today)
}

export function getDaysUntilDue(dueDate: string): number {
  const today = startOfDay(new Date())
  const due = startOfDay(parseISO(dueDate))
  return differenceInDays(due, today)
}

export function isDueSoon(task: Task, withinDays = 7): boolean {
  if (task.status === 'completed' || task.status === 'cancelled') return false
  const days = getDaysUntilDue(task.dueDate)
  return days >= 0 && days <= withinDays
}
