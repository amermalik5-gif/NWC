import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { AlertBanner } from '@/components/common/AlertBanner'
import { useUIStore } from '@/store/uiStore'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const initUsers = useAdminUsersStore((s) => s.init)
  const initConfig = useAdminConfigStore((s) => s.init)

  // Restore saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nwc-theme')
      if (saved === 'dark' || saved === 'light') {
        document.documentElement.setAttribute('data-theme', saved)
      }
    } catch {}
    initUsers()
    initConfig()
  }, [initUsers, initConfig])

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div
          className={cn(
            'flex flex-1 flex-col overflow-hidden transition-all duration-300',
            sidebarOpen ? 'ml-60' : 'ml-16'
          )}
        >
          <AlertBanner />
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  )
}
