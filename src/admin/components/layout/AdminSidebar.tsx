import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ListChecks,
  Building2,
  Briefcase,
  CircleDot,
  Flag,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/admin/auth/useAuth'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useState } from 'react'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Admin Dashboard', icon: LayoutDashboard, href: '/admin' },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Tasks', icon: ListChecks, href: '/admin/tasks' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Request Sources', icon: Building2, href: '/admin/sources' },
      { label: 'Service Categories', icon: Briefcase, href: '/admin/services' },
      { label: 'Task Statuses', icon: CircleDot, href: '/admin/statuses' },
      { label: 'Priority Levels', icon: Flag, href: '/admin/priorities' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Dashboard Control', icon: Activity, href: '/admin/dashboard-control' },
      { label: 'Settings', icon: Settings, href: '/admin/settings' },
    ],
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const { logout, user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-950 text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold leading-none whitespace-nowrap">Admin Panel</p>
              <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">NWC Task Tracker</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.href)

                const link = (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.href} delayDuration={0}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  )
                }
                return link
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-800 p-2 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 rounded-md bg-slate-900">
            <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={logout}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors',
                collapsed && 'justify-center px-2'
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
        </Tooltip>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
