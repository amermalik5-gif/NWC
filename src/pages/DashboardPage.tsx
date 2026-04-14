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
import { ROUTES } from '@/constants/routes'

export function DashboardPage() {
  const { filters } = useFilters()
  const { data: stats, isLoading: statsLoading } = useTaskStats(filters)
  const { data: allTasks, isLoading: tasksLoading } = useAllTasks(filters)

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
          <SummaryCards stats={stats} loading={statsLoading} />

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <TasksBySourceChart data={stats?.bySource} loading={statsLoading} />
            <TasksByServiceChart data={stats?.byServiceType} loading={statsLoading} />
            <TasksByStatusChart data={stats?.byStatus} loading={statsLoading} />
          </div>

          {/* Trend chart */}
          <MonthlyTrendChart data={stats?.byMonth} loading={statsLoading} />

          {/* Deadline + Source breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UpcomingDeadlines tasks={allTasks} loading={tasksLoading} />
            <SourceBreakdownTable data={stats?.sourceStats} loading={statsLoading} />
          </div>

          {/* Recent tasks */}
          <RecentTasksTable tasks={allTasks} loading={tasksLoading} />
        </div>
      </PageWrapper>
    </>
  )
}
