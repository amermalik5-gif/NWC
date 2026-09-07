import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Globe,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useTaskStats } from '@/hooks/useTaskStats'
import { DEFAULT_FILTERS } from '@/types/filters'
import { ROUTES } from '@/constants/routes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useUserAuthStore()
  const { data: stats } = useTaskStats(DEFAULT_FILTERS)
  const overdueCount = stats?.overdue ?? 0

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: 'All Tasks',  icon: ListChecks,     href: ROUTES.TASKS, badge: overdueCount > 0 ? overdueCount : 0 },
    { label: 'My Tasks',   icon: UserCircle,      href: ROUTES.MY_TASKS },
    { label: 'New Task',   icon: PlusCircle,      href: ROUTES.TASK_NEW },
    { label: 'Calendar',   icon: Calendar,        href: '/calendar' },
  ]

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
      style={{
        background: 'linear-gradient(180deg, #1565C0 0%, #0D47A1 60%, #0A3880 100%)',
      }}
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b px-4',
        'border-white/10'
      )}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* NWC Globe logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md">
            <Globe className="h-6 w-6 text-[#0D47A1]" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-base text-white whitespace-nowrap leading-tight">NWC</p>
              <p className="text-xs text-blue-200 whitespace-nowrap">Task Tracker</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href)

          const link = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white',
                !sidebarOpen && 'justify-center px-0'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="flex-1">{item.label}</span>}
              {/* Overdue badge */}
              {item.badge != null && item.badge > 0 && (
                sidebarOpen
                  ? <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  : <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          )

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                  {item.badge != null && item.badge > 0 && ` (${item.badge} overdue)`}
                </TooltipContent>
              </Tooltip>
            )
          }

          return link
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-white/10 px-2 py-3 space-y-1">
        {sidebarOpen && user && (
          <div className="mx-1 mb-2 rounded-xl bg-white/10 px-3 py-2.5">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-blue-200 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-all',
                !sidebarOpen && 'justify-center px-0'
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </TooltipTrigger>
          {!sidebarOpen && <TooltipContent side="right">Sign Out</TooltipContent>}
        </Tooltip>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-xl p-2 text-blue-200 hover:bg-white/10 hover:text-white transition-all"
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}
