import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AdminShell() {
  const initUsers = useAdminUsersStore((s) => s.init)
  const initConfig = useAdminConfigStore((s) => s.init)

  useEffect(() => {
    initUsers()
    initConfig()
  }, [initUsers, initConfig])
  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50">
        <AdminSidebar />
        {/* Content shifts right — sidebar is 64px collapsed / 256px expanded.
            We use a static 64px offset (collapsed default on smaller screens,
            and the sidebar animates via CSS transition). */}
        <div className="flex flex-1 flex-col overflow-hidden ml-64">
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  )
}
