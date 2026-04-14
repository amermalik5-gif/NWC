import { cn } from '@/lib/utils'

interface StatusDotProps {
  active: boolean
  label?: boolean
  className?: string
}

export function StatusDot({ active, label = true, className }: StatusDotProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          active ? 'bg-green-500' : 'bg-slate-300'
        )}
      />
      {label && (
        <span className={cn('text-xs font-medium', active ? 'text-green-700' : 'text-slate-400')}>
          {active ? 'Active' : 'Inactive'}
        </span>
      )}
    </span>
  )
}
