import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { setSidebarOpen } = useUIStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-nwc-muted bg-white px-6 shadow-sm">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-nwc-dark hover:bg-nwc-light"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* NWC accent bar on left */}
      <div className="hidden md:block w-1 h-8 rounded-full bg-gradient-to-b from-nwc-blue to-nwc-teal shrink-0" />

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-nwc-navy truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}
