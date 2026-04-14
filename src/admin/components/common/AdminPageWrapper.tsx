import { cn } from '@/lib/utils'

interface AdminPageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function AdminPageWrapper({ children, className }: AdminPageWrapperProps) {
  return (
    <div className={cn('flex-1 overflow-auto p-6', className)}>
      <div className={cn('max-w-[1200px] space-y-6', className)}>
        {children}
      </div>
    </div>
  )
}
