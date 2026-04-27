import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/store/uiStore'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const initUsers = useAdminUsersStore((s) => s.init)
  const initConfig = useAdminConfigStore((s) => s.init)

  useEffect(() => {
    initUsers()
    initConfig()
  }, [initUsers, initConfig])

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
