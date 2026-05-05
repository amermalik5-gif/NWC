import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, addComment, deleteComment, getActivity } from '@/services/commentService'

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => getComments(taskId),
    enabled: !!taskId,
  })
}

export function useActivity(taskId: string) {
  return useQuery({
    queryKey: ['activity', taskId],
    queryFn: () => getActivity(taskId),
    enabled: !!taskId,
  })
}

export function useAddComment(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ body, authorName, authorId }: { body: string; authorName: string; authorId: string }) =>
      addComment(taskId, body, authorName, authorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', taskId] })
      qc.invalidateQueries({ queryKey: ['activity', taskId] })
    },
  })
}

export function useDeleteComment(taskId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(taskId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', taskId] })
    },
  })
}
