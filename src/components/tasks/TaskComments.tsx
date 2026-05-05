import { useState } from 'react'
import { MessageSquare, Trash2, Send, Loader2, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useComments, useActivity, useAddComment, useDeleteComment } from '@/hooks/useComments'
import { useUserAuthStore } from '@/store/userAuthStore'
import { cn } from '@/lib/utils'
import type { ActivityEntry, TaskComment } from '@/types/task'

interface Props {
  taskId: string
}

function TimeAgo({ date }: { date: string }) {
  return (
    <span className="text-xs text-slate-400">
      {formatDistanceToNow(new Date(date), { addSuffix: true })}
    </span>
  )
}

function CommentItem({ comment, onDelete, canDelete }: {
  comment: TaskComment
  onDelete: (id: string) => void
  canDelete: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nwc-blue text-white text-xs font-bold">
        {comment.authorName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-800">{comment.authorName}</span>
          <TimeAgo date={comment.createdAt} />
        </div>
        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          className="shrink-0 text-slate-300 hover:text-red-500 transition-colors mt-1"
          title="Delete comment"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 mt-0.5">
        <Activity className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-800">{entry.authorName}</span>{' '}
          {entry.action}
          {entry.field === 'status' && entry.oldValue && entry.newValue && (
            <> from <span className="font-medium">{entry.oldValue.replace('_', ' ')}</span> to <span className="font-medium">{entry.newValue.replace('_', ' ')}</span></>
          )}
        </p>
        <TimeAgo date={entry.createdAt} />
      </div>
    </div>
  )
}

export function TaskComments({ taskId }: Props) {
  const { user, isAuthenticated } = useUserAuthStore()
  const { data: comments = [], isLoading: commentsLoading } = useComments(taskId)
  const { data: activity = [], isLoading: activityLoading } = useActivity(taskId)
  const addComment = useAddComment(taskId)
  const deleteComment = useDeleteComment(taskId)

  const [body, setBody] = useState('')
  const [tab, setTab] = useState<'comments' | 'activity'>('comments')

  const handleSubmit = async () => {
    if (!body.trim() || !user) return
    await addComment.mutateAsync({ body, authorName: user.name, authorId: user.id })
    setBody('')
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTab('comments')}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium pb-1 border-b-2 transition-colors',
              tab === 'comments'
                ? 'border-nwc-blue text-nwc-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Comments {comments.length > 0 && `(${comments.length})`}
          </button>
          <button
            onClick={() => setTab('activity')}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium pb-1 border-b-2 transition-colors',
              tab === 'activity'
                ? 'border-nwc-blue text-nwc-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            <Activity className="h-4 w-4" />
            Activity
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {tab === 'comments' ? (
          <>
            {/* Comment input */}
            {isAuthenticated && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nwc-teal text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={3}
                    className="resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">Ctrl+Enter to submit</p>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!body.trim() || addComment.isPending}
                      className="h-8"
                    >
                      {addComment.isPending
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <><Send className="h-3.5 w-3.5" /> Post</>
                      }
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-5">
                {comments.map((c) => (
                  <CommentItem
                    key={c.id}
                    comment={c}
                    canDelete={isAuthenticated && (c.authorId === user?.id)}
                    onDelete={(id) => deleteComment.mutate(id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {activityLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No activity recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {activity.map((entry) => (
                  <ActivityItem key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
