import { Eye, EyeOff, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { useAdminSettingsStore } from '@/admin/store/adminSettingsStore'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

export function DashboardControlPage() {
  const { settings, toggleWidget } = useAdminSettingsStore()
  const { toast } = useToast()
  const widgets = [...settings.dashboardWidgets].sort((a, b) => a.order - b.order)

  const visibleCount = widgets.filter((w) => w.visible).length

  const handleToggle = (id: string, label: string, currentVisible: boolean) => {
    toggleWidget(id)
    toast({
      title: currentVisible ? 'Widget hidden' : 'Widget shown',
      description: `"${label}" is now ${currentVisible ? 'hidden from' : 'visible on'} the dashboard.`,
    })
  }

  const showAll = () => {
    widgets.filter((w) => !w.visible).forEach((w) => toggleWidget(w.id))
    toast({ title: 'All widgets shown' })
  }

  const hideAll = () => {
    widgets.filter((w) => w.visible).forEach((w) => toggleWidget(w.id))
    toast({ title: 'All widgets hidden' })
  }

  return (
    <>
      <AdminHeader
        title="Dashboard Control"
        subtitle="Show or hide widgets on the main dashboard"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={hideAll} disabled={visibleCount === 0}>
              <EyeOff className="h-4 w-4 mr-1" />Hide All
            </Button>
            <Button size="sm" variant="outline" onClick={showAll} disabled={visibleCount === widgets.length}>
              <Eye className="h-4 w-4 mr-1" />Show All
            </Button>
          </div>
        }
      />
      <AdminPageWrapper>
        {/* Summary */}
        <div className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-sm text-sm text-slate-600">
          <LayoutDashboard className="h-5 w-5 text-slate-400" />
          <span>
            <strong className="text-slate-800">{visibleCount}</strong> of{' '}
            <strong className="text-slate-800">{widgets.length}</strong> widgets currently visible on the dashboard.
          </span>
        </div>

        <Card>
          <div className="divide-y">
            {widgets.map((widget, index) => (
              <div
                key={widget.id}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 transition-colors',
                  !widget.visible && 'opacity-50'
                )}
              >
                {/* Order badge */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                  {index + 1}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800">{widget.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{widget.description}</p>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <Label
                    htmlFor={`widget-${widget.id}`}
                    className={cn(
                      'text-xs font-medium cursor-pointer',
                      widget.visible ? 'text-emerald-600' : 'text-slate-400'
                    )}
                  >
                    {widget.visible ? 'Visible' : 'Hidden'}
                  </Label>
                  <Switch
                    id={`widget-${widget.id}`}
                    checked={widget.visible}
                    onCheckedChange={() => handleToggle(widget.id, widget.label, widget.visible)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <p className="text-xs text-slate-400 text-center">
          Changes take effect immediately on the dashboard. Widget order follows the list above.
        </p>
      </AdminPageWrapper>
    </>
  )
}
