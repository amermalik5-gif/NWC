import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUserAuthStore } from '@/store/userAuthStore'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { getTextDir } from '@/lib/textDir'
import type { Task, TaskComment } from '@/types/task'

async function addComment(taskId: string, text: string, author: { name: string; id: string }): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, authorName: author.name, authorId: author.id }),
  })
  if (!res.ok) throw new Error('Failed to add comment')
  return res.json()
}

interface TaskCommentsProps {
  task: Task
}

function CommentBubble({ comment }: { comment: TaskComment }) {
  const isSystem = comment.type === 'status_change' || comment.type === 'system'
  if (isSystem) {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {comment.meta?.from && comment.meta?.to
            ? `${comment.authorName} changed status: ${comment.meta.from} → ${comment.meta.to}`
            : comment.text}
          {' · '}{formatDate(comment.createdAt, 'MMM d, HH:mm')}
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          {comment.authorName.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-semibold text-slate-700">{comment.authorName}</span>
        <span className="text-xs text-slate-400">{formatDate(comment.createdAt, 'MMM d, yyyy HH:mm')}</span>
      </div>
      <div
        className="ml-8 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 leading-relaxed border border-slate-100"
        dir={getTextDir(comment.text)}
      >
        {comment.text}
      </div>
    </div>
  )
}

export function TaskComments({ task }: TaskCommentsProps) {
  const [text, setText] = useState('')
  const { user } = useUserAuthStore()
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => addComment(task.id, text.trim(), { name: user?.name ?? 'Unknown', id: user?.id ?? '' }),
    onSuccess: (updated) => {
      qc.setQueryData(['task', task.id], updated)
      qc.invalidateQueries({ queryKey: ['tasks'] })
      setText('')
    },
  })

  const comments = task.comments ?? []

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-slate-600">
          <MessageSquare className="h-4 w-4" />
          Comments & Activity
          {comments.length > 0 && (
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {comments.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first to add one.</p>
        )}
        {comments.map((c) => (
          <CommentBubble key={c.id} comment={c} />
        ))}

        {/* Add comment */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <Textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            dir={getTextDir(text) || 'auto'}
            className="resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && text.trim()) {
                mutation.mutate()
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Ctrl+Enter to submit</span>
            <Button
              size="sm"
              onClick={() => mutation.mutate()}
              disabled={!text.trim() || mutation.isPending}
            >
              <Send className="h-3.5 w-3.5" />
              {mutation.isPending ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
