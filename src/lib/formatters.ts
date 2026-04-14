import { format, parseISO } from 'date-fns'

export function formatDate(dateStr: string | null | undefined, pattern = 'MMM d, yyyy'): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), pattern)
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string | null | undefined): string {
  return formatDate(dateStr, 'MMM d')
}

export function formatTaskId(id: string): string {
  return id.toUpperCase()
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
