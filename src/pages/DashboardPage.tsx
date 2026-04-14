import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TasksBySourceChart } from '@/components/dashboard/TasksBySourceChart'
import { TasksByServiceChart } from '@/components/dashboard/TasksByServiceChart'
import { TasksByStatusChart } from '@/components/dashboard/TasksByStatusChart'
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart'
import { SourceBreakdownTable } from '@/components/dashboard/SourceBreakdownTable'
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines'
import { RecentTasksTable } from '@/components/dashboard/RecentTasksTable'
import { DashboardFilterBar } from '@/components/dashboard/DashboardFilterBar'
import { ActiveFiltersBar } from '@/components/common/ActiveFiltersBar'
import { useTaskStats } from '@/hooks/useTaskStats'
import { useAllTasks } from '@/hooks/useTasks'
import { useFilters } from '@/hooks/useFilters'
import { useAdminSettingsStore } from '@/admin/store/adminSettingsStore'
import { ROUTES } from '@/constants/routes'

export function DashboardPage() {
  const { filters } = useFilters()
  const { data: stats, isLoading: statsLoading } = useTaskStats(filters)
  const { data: allTasks, isLoading: tasksLoading } = useAllTasks(filters)

  // Widget visibility controlled from the Admin → Dashboard Control page
  const { settings } = useAdminSettingsStore()
  const widgetVisible = (id: string) =>
    settings.dashboardWidgets.find((w) => w.id === id)?.visible ?? true

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Task overview and performance metrics"
        actions={
          <Button size="sm" asChild>
            <Link to={ROUTES.TASK_NEW}>
              <Plus className="h-4 w-4" />
              New Task
            </Link>
          </Button>
        }
      />
      <PageWrapper>
        <div className="space-y-6 max-w-[1400px]">
          {/* Filters */}
          <DashboardFilterBar />
          <ActiveFiltersBar />

          {/* KPI Cards */}
          {widgetVisible('summary-cards') && (
            <SummaryCards stats={stats} loading={statsLoading} />
          )}

          {/* Charts row — only render the row if at least one chart is visible */}
          {(widgetVisible('source-chart') || widgetVisible('service-chart') || widgetVisible('status-chart')) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {widgetVisible('source-chart') && (
                <TasksBySourceChart data={stats?.bySource} loading={statsLoading} />
              )}
              {widgetVisible('service-chart') && (
                <TasksByServiceChart data={stats?.byServiceType} loading={statsLoading} />
              )}
              {widgetVisible('status-chart') && (
                <TasksByStatusChart data={stats?.byStatus} loading={statsLoading} />
              )}
            </div>
          )}

          {/* Trend chart */}
          {widgetVisible('monthly-trend') && (
            <MonthlyTrendChart data={stats?.byMonth} loading={statsLoading} />
          )}

          {/* Deadline + Source breakdown */}
          {(widgetVisible('upcoming-deadlines') || widgetVisible('source-breakdown')) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {widgetVisible('upcoming-deadlines') && (
                <UpcomingDeadlines tasks={allTasks} loading={tasksLoading} />
              )}
              {widgetVisible('source-breakdown') && (
                <SourceBreakdownTable data={stats?.sourceStats} loading={statsLoading} />
              )}
            </div>
          )}

          {/* Recent tasks */}
          {widgetVisible('recent-tasks') && (
            <RecentTasksTable tasks={allTasks} loading={tasksLoading} />
          )}
        </div>
      </PageWrapper>
    </>
  )
}
