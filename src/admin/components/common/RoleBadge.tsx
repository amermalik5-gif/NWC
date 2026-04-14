import { cn } from '@/lib/utils'
import type { UserRole } from '@/admin/types'

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-red-100 text-red-700 border-red-200' },
  manager: { label: 'Manager', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  team_member: { label: 'Team Member', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  viewer: { label: 'Viewer', className: 'bg-slate-100 text-slate-600 border-slate-200' },
}

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const config = ROLE_CONFIG[role]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
