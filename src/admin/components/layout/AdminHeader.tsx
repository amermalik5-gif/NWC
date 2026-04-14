import { Link } from 'react-router-dom'
import { ExternalLink, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/admin/auth/useAuth'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-6">
      {/* Admin badge */}
      <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-2 py-1">
        <Shield className="h-3.5 w-3.5 text-red-600" />
        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Admin</span>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
          <Link to="/">
            <ExternalLink className="h-3.5 w-3.5" />
            Back to App
          </Link>
        </Button>
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-right">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-700">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
