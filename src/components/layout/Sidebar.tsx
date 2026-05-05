import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useUserAuthStore } from '@/store/userAuthStore'
import { ROUTES } from '@/constants/routes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import NwcLogo from '@/assets/nwc-logo-white.svg'

const publicNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: 'All Tasks',  icon: ListChecks,      href: ROUTES.TASKS },
  { label: 'Calendar',   icon: Calendar,        href: ROUTES.CALENDAR },
]

const authNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: 'All Tasks',  icon: ListChecks,      href: ROUTES.TASKS },
  { label: 'New Task',   icon: PlusCircle,      href: ROUTES.TASK_NEW },
  { label: 'Calendar',   icon: Calendar,        href: ROUTES.CALENDAR },
]

export function Sidebar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore()
  const { user, isAuthenticated, logout } = useUserAuthStore()
  const navItems  = isAuthenticated ? authNavItems : publicNavItems
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleNavClick() { if (isMobile) setSidebarOpen(false) }
  function handleLogout()   { logout(); navigate('/login', { replace: true }) }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen text-white transition-all duration-300 flex flex-col nwc-gradient',
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* ── Logo ── */}
      <div className="flex h-16 items-center border-b border-white/10 px-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={NwcLogo}
            alt="NWC"
            className="h-9 w-9 shrink-0 rounded-full bg-white/10 p-0.5"
          />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white whitespace-nowrap leading-tight">NWC</p>
              <p className="text-[10px] text-blue-200 whitespace-nowrap">Task Tracker</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href)

          const link = (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white',
                !sidebarOpen && 'justify-center px-0'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }
          return link
        })}
      </nav>

      {/* ── Footer: user + auth ── */}
      <div className="border-t border-white/10 px-2 py-3 space-y-1">
        {sidebarOpen && user && (
          <div className="px-3 py-2 mb-1 rounded-lg bg-white/10">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-blue-200 capitalize">{user.role.replace('_', ' ')}</p>
          </div>
        )}

        {isAuthenticated ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors',
                  !sidebarOpen && 'justify-center px-0'
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>Sign Out</span>}
              </button>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Sign Out</TooltipContent>}
          </Tooltip>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/login"
                onClick={handleNavClick}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors',
                  !sidebarOpen && 'justify-center px-0'
                )}
              >
                <LogIn className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>Sign In</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && <TooltipContent side="right">Sign In</TooltipContent>}
          </Tooltip>
        )}

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
      </div>
    </aside>
  )
}
