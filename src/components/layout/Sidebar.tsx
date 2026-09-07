import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useTaskStats } from '@/hooks/useTaskStats'
import { DEFAULT_FILTERS } from '@/types/filters'
import { ROUTES } from '@/constants/routes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// ── Theme toggle (persisted to localStorage) ────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return (localStorage.getItem('nwc-theme') as 'light' | 'dark') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('nwc-theme', theme) } catch {}
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }
}

// ── NWC Logo SVG ─────────────────────────────────────────────────────────────
function NWCLogo({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#00569A]">
        <span className="text-[10px] font-black text-white tracking-tight leading-none">NWC</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2.5 overflow-hidden">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#00569A]">
        <span className="text-[10px] font-black text-white tracking-tight leading-none">NWC</span>
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-bold text-white whitespace-nowrap leading-tight">NWC</p>
        <p className="text-[10px] text-slate-400 whitespace-nowrap">Task Tracker</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useUserAuthStore()
  const { data: stats } = useTaskStats(DEFAULT_FILTERS)
  const { theme, toggle: toggleTheme } = useTheme()
  const overdueCount = stats?.overdue ?? 0

  const navItems = [
    { label: 'Dashboard',  icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: 'All Tasks',  icon: ListChecks,       href: ROUTES.TASKS, badge: overdueCount > 0 ? overdueCount : 0 },
    { label: 'My Tasks',   icon: UserCircle,        href: ROUTES.MY_TASKS },
    { label: 'New Task',   icon: PlusCircle,        href: ROUTES.TASK_NEW },
  ]

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-700 px-4">
        <NWCLogo collapsed={!sidebarOpen} />
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
                'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#00569A] text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
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

      {/* Footer: user info, theme toggle, logout, collapse */}
      <div className="border-t border-slate-700 px-2 py-3 space-y-1">
        {sidebarOpen && user && (
          <div className="px-2 py-1 mb-1">
            <p className="text-xs font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}

        {/* Dark mode toggle */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors',
                !sidebarOpen && 'justify-center px-0'
              )}
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4 shrink-0" />
                : <Moon className="h-4 w-4 shrink-0" />}
              {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </TooltipTrigger>
          {!sidebarOpen && (
            <TooltipContent side="right">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors',
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
          className="flex w-full items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
    </aside>
  )
}
