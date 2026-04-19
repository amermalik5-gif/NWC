import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/task'
import { getConfigSnapshot } from '@/hooks/useConfigOptions'
import { STATUS_CONFIG } from '@/constants/statusConfig'
import { PRIORITY_CONFIG } from '@/constants/priorityConfig'
import { formatDate } from '@/lib/formatters'

function tasksToCsv(tasks: Task[]): string {
  // Pull live labels from the admin config store (works outside React via getState())
  const { SOURCE_LABEL, SERVICE_LABEL } = getConfigSnapshot()

  const headers = [
    'Task ID',
    'Title',
    'Status',
    'Priority',
    'Request Source',
    'Service Type(s)',
    'Requester',
    'Assigned To',
    'Request Date',
    'Due Date',
    'Completion Date',
    'Blocker',
    'Notes',
  ]

  const rows = tasks.map((t) => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    STATUS_CONFIG[t.status].label,
    PRIORITY_CONFIG[t.priority].label,
    SOURCE_LABEL[t.requestSource] ?? t.requestSource,
    `"${(t.serviceTypes ?? []).map((s) => SERVICE_LABEL[s] ?? s).join('; ')}"`,
    t.requesterName,
    t.assignedTo,
    formatDate(t.requestDate),
    formatDate(t.dueDate),
    formatDate(t.completionDate),
    t.blocker ? `"${t.blocker.replace(/"/g, '""')}"` : '',
    `"${t.notes.replace(/"/g, '""')}"`,
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
}

interface ExportButtonProps {
  tasks: Task[]
  filename?: string
}

export function ExportButton({ tasks, filename = 'tasks-export.csv' }: ExportButtonProps) {
  const handleExport = () => {
    const csv = tasksToCsv(tasks)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={tasks.length === 0}>
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  )
}
