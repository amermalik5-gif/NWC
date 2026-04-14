import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div
          className={cn(
            'flex flex-1 flex-col overflow-hidden transition-all duration-300',
            sidebarOpen ? 'ml-60' : 'ml-16'
          )}
        >
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  )
}
