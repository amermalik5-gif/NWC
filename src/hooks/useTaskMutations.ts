import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, updateTask, deleteTask } from '@/services/taskService'
import type { CreateTaskInput, UpdateTaskInput } from '@/types/task'

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['tasks-all'] })
      qc.invalidateQueries({ queryKey: ['task-stats'] })
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['tasks-all'] })
      qc.invalidateQueries({ queryKey: ['task-stats'] })
      qc.setQueryData(['task', updated.id], updated)
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['tasks-all'] })
      qc.invalidateQueries({ queryKey: ['task-stats'] })
    },
  })
}
