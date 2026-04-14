import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('flex-1 overflow-auto p-6', className)}>
      {children}
    </div>
  )
}
