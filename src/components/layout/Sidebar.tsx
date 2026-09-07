import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  UserCircle,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useUserAuthStore } from '@/store/userAuthStore'
import { useTaskStats } from '@/hooks/useTaskStats'
import { DEFAULT_FILTERS } from '@/types/filters'
import { ROUTES } from '@/constants/routes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function NWCLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="40" height="40" viewBox="0 0 56.303 56.303">
      <defs>
        <linearGradient id="nwc-lg1" x1="0.398" y1="0.387" x2="0.747" y2="0.929" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#d3f0f9"/>
          <stop offset="0.448" stopColor="#a2d0e0"/>
          <stop offset="1" stopColor="#72a3c4"/>
        </linearGradient>
        <linearGradient id="nwc-lg2" x1="0.5" y1="1.175" x2="0.5" y2="-0.175" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#00af8d"/>
          <stop offset="0.634" stopColor="#288bc5"/>
          <stop offset="1" stopColor="#11448c"/>
        </linearGradient>
      </defs>
      <g transform="translate(-1544.888 -26)">
        <g transform="translate(1544.888 26)">
          <g transform="translate(0 0)">
            <circle cx="28.151" cy="28.151" r="28.151" fill="#fff"/>
            <path d="M1231.43,813.188a21.548,21.548,0,0,1-13.714-4.887,20.956,20.956,0,0,1-7.729-16.237c0-3.68,2.237-9.047,3.917-12.06a24.593,24.593,0,0,0-8.6,19.225,24.044,24.044,0,0,0,.974,6.767,18.505,18.505,0,0,0,5.353,8.937,12.076,12.076,0,0,0,3.84,2.238,13.527,13.527,0,0,0,3.9.859l.177,0q.32.009.641.011a26.755,26.755,0,0,0,16.086-5.408A21.751,21.751,0,0,1,1231.43,813.188Z" transform="translate(-1191.772 -762.985)" fill="#1773b3"/>
            <path d="M1312.343,746.9a26.615,26.615,0,0,0-4.222-1.5c1.932,3.416,2.094,5.821,2.094,10.026a22.274,22.274,0,0,1-21.628,22.761,23.048,23.048,0,0,0,14.455,4.783,11.34,11.34,0,0,0,4.486-.867c6.411-4.919,9.665-11.366,9.665-20.072C1317.193,755.731,1315.97,751.481,1312.343,746.9Z" transform="translate(-1262.029 -733.795)" fill="url(#nwc-lg1)"/>
            <path d="M1125.8,705c0,11.069,8.657,22.941,18.441,25.509a23.754,23.754,0,0,1-7.8-17.8,26.575,26.575,0,0,1,21.282-26,26.745,26.745,0,0,1,16.354,1.819c.071.032.142.062.212.094A27.06,27.06,0,0,0,1125.8,705Z" transform="translate(-1124.706 -677.008)" fill="url(#nwc-lg2)"/>
          </g>
        </g>
      </g>
    </svg>
  )
}

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
    ...(user ? [
      { label: 'My Tasks', icon: UserCircle, href: ROUTES.MY_TASKS },
      { label: 'New Task', icon: PlusCircle, href: ROUTES.TASK_NEW },
    ] : []),
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
      <div className="flex h-16 items-center border-b border-white/10 px-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0">
            <NWCLogo />
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
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white',
                !sidebarOpen && 'justify-center px-0'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="flex-1">{item.label}</span>}
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

        {user ? (
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
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/login"
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-all',
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
