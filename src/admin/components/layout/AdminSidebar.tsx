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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import NwcLogo from '@/assets/nwc-logo-white.svg'
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
        'fixed left-0 top-0 z-40 h-screen nwc-gradient text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={NwcLogo}
            alt="NWC"
            className="h-9 w-9 shrink-0 rounded-full bg-white/10 p-0.5"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white whitespace-nowrap leading-tight">NWC Admin</p>
              <p className="text-[10px] text-blue-200 whitespace-nowrap flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-200/60">
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
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white',
                      collapsed && 'justify-center px-0'
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
      <div className="border-t border-white/10 px-2 py-3 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1 rounded-lg bg-white/10">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-blue-200 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={logout}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors',
                collapsed && 'justify-center px-0'
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
          className="flex w-full items-center justify-center rounded-lg p-2 text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}
