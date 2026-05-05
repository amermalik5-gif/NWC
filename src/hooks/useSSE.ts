import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Subscribes to the SSE /api/events endpoint and invalidates
 * TanStack Query caches when tasks or comments change.
 */
export function useSSE() {
  const qc = useQueryClient()

  useEffect(() => {
    let es: EventSource | null = null
    let retryTimeout: ReturnType<typeof setTimeout>

    function connect() {
      es = new EventSource('/api/events')

      es.onmessage = (e) => {
        try {
          const { type } = JSON.parse(e.data) as { type: string }
          if (type === 'task_created' || type === 'task_updated' || type === 'task_deleted' || type === 'tasks_bulk_updated') {
            qc.invalidateQueries({ queryKey: ['tasks'] })
            qc.invalidateQueries({ queryKey: ['taskStats'] })
          }
          if (type === 'comment_added') {
            qc.invalidateQueries({ queryKey: ['comments'] })
            qc.invalidateQueries({ queryKey: ['activity'] })
          }
        } catch (_) {}
      }

      es.onerror = () => {
        es?.close()
        // Reconnect after 5 seconds
        retryTimeout = setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      es?.close()
      clearTimeout(retryTimeout)
    }
  }, [qc])
}
