import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/store/uiStore'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppShell() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const initUsers = useAdminUsersStore((s) => s.init)
  const initConfig = useAdminConfigStore((s) => s.init)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    initUsers()
    initConfig()
  }, [initUsers, initConfig])

  // Auto-collapse sidebar on mobile, expand on desktop
  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setSidebarOpen])

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50">
        {/* Backdrop overlay when sidebar open on mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar />
        <div
          className={cn(
            'flex flex-1 flex-col overflow-hidden transition-all duration-300',
            isMobile ? 'ml-0' : sidebarOpen ? 'ml-60' : 'ml-16'
          )}
        >
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  )
}
