import { Link } from 'react-router-dom'
import {
  Users, ListChecks, Building2, Briefcase, Settings,
  TrendingUp, AlertCircle, CheckCircle2, Clock, Shield,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'
import { useAdminSettingsStore } from '@/admin/store/adminSettingsStore'
import { useTaskStats } from '@/hooks/useTaskStats'
import { DEFAULT_FILTERS } from '@/types/filters'
import { formatDate } from '@/lib/formatters'

const QUICK_LINKS = [
  { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
  { label: 'Manage Tasks', icon: ListChecks, href: '/admin/tasks', color: 'bg-green-50 text-green-700', border: 'border-green-200' },
  { label: 'Request Sources', icon: Building2, href: '/admin/sources', color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
  { label: 'Service Categories', icon: Briefcase, href: '/admin/services', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
  { label: 'System Settings', icon: Settings, href: '/admin/settings', color: 'bg-slate-50 text-slate-700', border: 'border-slate-200' },
]

export function AdminDashboardPage() {
  const { users } = useAdminUsersStore()
  const { sources, services, statuses, priorities } = useAdminConfigStore()
  const { auditLogs } = useAdminSettingsStore()
  const { data: stats } = useTaskStats(DEFAULT_FILTERS)

  const activeUsers = users.filter((u) => u.status === 'active').length
  const recentLogs = auditLogs.slice(0, 5)

  return (
    <>
      <AdminHeader
        title="Admin Dashboard"
        subtitle="System overview and quick access"
      />
      <AdminPageWrapper>
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Users', value: users.length, sub: `${activeUsers} active`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Tasks', value: stats?.total ?? '—', sub: `${stats?.overdue ?? 0} overdue`, icon: ListChecks, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Config Items', value: sources.length + services.length + statuses.length + priorities.length, sub: 'Sources, services, etc.', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Audit Events', value: auditLogs.length, sub: 'Activity records', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                  <p className="text-xs text-slate-400">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task stats mini row */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Open', value: stats.open, icon: Clock, color: 'text-blue-600' },
              { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-amber-600' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-green-600' },
              { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-600' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-lg border bg-white p-4">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-lg font-bold text-slate-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick links */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2">
              <div className="px-4 space-y-1">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-3 rounded-lg border ${link.border} ${link.color} px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">Recent Activity</CardTitle>
              <Link to="/admin/settings" className="text-xs text-blue-600 hover:underline">
                View all logs →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Action</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Actor</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Detail</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-2.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-600 uppercase">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-medium text-slate-700">{log.actor}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 max-w-[200px] truncate">{log.detail}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-400 whitespace-nowrap">{formatDate(log.timestamp, 'MMM d, HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </AdminPageWrapper>
    </>
  )
}
