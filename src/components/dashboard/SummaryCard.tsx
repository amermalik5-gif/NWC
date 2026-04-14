import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface SummaryCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  loading?: boolean
  highlight?: boolean
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  loading,
  highlight,
}: SummaryCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(highlight && 'border-red-200 bg-red-50')}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', iconBg)}>
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className={cn('text-2xl font-bold', highlight ? 'text-red-600' : 'text-slate-900')}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
