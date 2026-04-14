import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/constants/routes'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: 'All Tasks', icon: ListChecks, href: ROUTES.TASKS },
  { label: 'New Task', icon: PlusCircle, href: ROUTES.TASK_NEW },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-700 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600">
            <ClipboardList className="h-4 w-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-sm whitespace-nowrap">Task Tracker</span>
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
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
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

      {/* Toggle button */}
      <div className="border-t border-slate-700 p-2">
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
