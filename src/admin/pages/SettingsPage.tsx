import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Bell, Workflow, Settings2, ScrollText, Shield, LogIn, LogOut, Pencil, Trash2, User, Cog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { useAdminSettingsStore } from '@/admin/store/adminSettingsStore'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/formatters'
import type { AuditAction } from '@/admin/types'

// ─── Schemas ─────────────────────────────────────────────────────────────────

const generalSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  appTagline: z.string(),
})

type GeneralFormData = z.infer<typeof generalSchema>

// ─── Audit action display helpers ────────────────────────────────────────────

const ACTION_CONFIG: Record<AuditAction, { label: string; icon: React.ReactNode; color: string }> = {
  login:           { label: 'Login',          icon: <LogIn className="h-3.5 w-3.5" />,  color: 'text-emerald-600 bg-emerald-50' },
  logout:          { label: 'Logout',         icon: <LogOut className="h-3.5 w-3.5" />, color: 'text-slate-500 bg-slate-100' },
  create_task:     { label: 'Create Task',    icon: <Pencil className="h-3.5 w-3.5" />, color: 'text-blue-600 bg-blue-50' },
  update_task:     { label: 'Update Task',    icon: <Pencil className="h-3.5 w-3.5" />, color: 'text-amber-600 bg-amber-50' },
  delete_task:     { label: 'Delete Task',    icon: <Trash2 className="h-3.5 w-3.5" />, color: 'text-red-600 bg-red-50' },
  create_user:     { label: 'Create User',    icon: <User className="h-3.5 w-3.5" />,   color: 'text-blue-600 bg-blue-50' },
  update_user:     { label: 'Update User',    icon: <User className="h-3.5 w-3.5" />,   color: 'text-amber-600 bg-amber-50' },
  delete_user:     { label: 'Delete User',    icon: <User className="h-3.5 w-3.5" />,   color: 'text-red-600 bg-red-50' },
  update_config:   { label: 'Config Change',  icon: <Cog className="h-3.5 w-3.5" />,    color: 'text-violet-600 bg-violet-50' },
  update_settings: { label: 'Settings',       icon: <Settings2 className="h-3.5 w-3.5" />, color: 'text-indigo-600 bg-indigo-50' },
}

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = 'general' | 'notifications' | 'workflow' | 'audit'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'general',       label: 'General',       icon: <Settings2 className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'workflow',      label: 'Workflow',       icon: <Workflow className="h-4 w-4" /> },
  { id: 'audit',         label: 'Audit Log',      icon: <ScrollText className="h-4 w-4" /> },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { settings, auditLogs, updateSettings } = useAdminSettingsStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('general')

  // General form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      appName: settings.appName,
      appTagline: settings.appTagline,
    },
  })

  const onSaveGeneral = (data: GeneralFormData) => {
    updateSettings({ appName: data.appName, appTagline: data.appTagline })
    reset(data)
    toast({ title: 'Settings saved', description: 'General settings have been updated.' })
  }

  const handleNotifChange = (key: keyof typeof settings.notifications, value: boolean | number) => {
    updateSettings({ notifications: { ...settings.notifications, [key]: value } })
    toast({ title: 'Notification setting updated' })
  }

  const handleWorkflowChange = (key: keyof typeof settings.workflow, value: string | boolean) => {
    updateSettings({ workflow: { ...settings.workflow, [key]: value } })
    toast({ title: 'Workflow setting updated' })
  }

  return (
    <>
      <AdminHeader
        title="System Settings"
        subtitle="Configure application behaviour, notifications, and workflow defaults"
      />
      <AdminPageWrapper>
        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg border bg-white p-1 shadow-sm w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── General ─────────────────────────────────────────────── */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSaveGeneral)} className="space-y-5 max-w-lg">
              <div>
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  className="mt-1"
                  {...register('appName')}
                />
                {errors.appName && (
                  <p className="mt-1 text-xs text-red-500">{errors.appName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="appTagline">Tagline / Subtitle</Label>
                <Input
                  id="appTagline"
                  className="mt-1"
                  placeholder="Short description shown in the sidebar"
                  {...register('appTagline')}
                />
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={!isDirty} className="bg-red-600 hover:bg-red-700">
                  <Save className="h-4 w-4 mr-2" />Save Changes
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* ── Notifications ────────────────────────────────────────── */}
        {activeTab === 'notifications' && (
          <Card className="p-6">
            <div className="max-w-lg space-y-5">
              <p className="text-sm text-slate-500">
                Configure when and how email notifications are sent for task events.
              </p>

              {[
                { key: 'emailOnNewTask' as const,       label: 'Notify on new task',          desc: 'Send an email when a new task is created' },
                { key: 'emailOnStatusChange' as const,  label: 'Notify on status change',     desc: 'Send an email when a task status changes' },
                { key: 'emailOnOverdue' as const,       label: 'Notify on overdue tasks',     desc: 'Send a reminder email for overdue tasks' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <Switch
                    checked={settings.notifications[key] as boolean}
                    onCheckedChange={(v) => handleNotifChange(key, v)}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Overdue reminder (days before)</Label>
                  <p className="text-xs text-slate-400 mt-0.5">How many days before due date to send the first reminder</p>
                </div>
                <Select
                  value={String(settings.notifications.overdueReminderDays)}
                  onValueChange={(v) => handleNotifChange('overdueReminderDays', Number(v))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 7].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} day{n > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}

        {/* ── Workflow ─────────────────────────────────────────────── */}
        {activeTab === 'workflow' && (
          <Card className="p-6">
            <div className="max-w-lg space-y-5">
              <p className="text-sm text-slate-500">
                Control task creation defaults and required field behaviour.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Default Status</Label>
                  <Select
                    value={settings.workflow.defaultStatus}
                    onValueChange={(v) => handleWorkflowChange('defaultStatus', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['new', 'in_progress', 'on_hold'].map((s) => (
                        <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Default Priority</Label>
                  <Select
                    value={settings.workflow.defaultPriority}
                    onValueChange={(v) => handleWorkflowChange('defaultPriority', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['low', 'medium', 'high', 'urgent'].map((p) => (
                        <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {[
                { key: 'requireDueDate' as const,  label: 'Require due date',  desc: 'Task cannot be submitted without a due date' },
                { key: 'requireAssignee' as const, label: 'Require assignee',  desc: 'Task cannot be submitted without an assigned team member' },
                { key: 'allowSelfAssign' as const, label: 'Allow self-assign', desc: 'Users can assign tasks to themselves' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <Switch
                    checked={settings.workflow[key] as boolean}
                    onCheckedChange={(v) => handleWorkflowChange(key, v)}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Audit Log ───────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <Card>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4 text-slate-400" />
                <span>Showing the last <strong>{auditLogs.length}</strong> audit events</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    {['Action', 'Actor', 'Target', 'Detail', 'IP', 'Timestamp'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => {
                    const cfg = ACTION_CONFIG[log.action]
                    return (
                      <tr key={log.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', cfg.color)}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">{log.actor}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.target ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[280px] truncate">{log.detail}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.ip ?? '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </td>
                      </tr>
                    )
                  })}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </AdminPageWrapper>
    </>
  )
}
