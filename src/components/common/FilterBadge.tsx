import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterBadgeProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

export function FilterBadge({ label, value, onRemove, className }: FilterBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-700',
        className
      )}
    >
      <span className="text-blue-500">{label}:</span>
      {value}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
