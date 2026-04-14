import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SystemSettings, DashboardWidget, AuditLog } from '@/admin/types'
import { defaultSettings, mockAuditLogs } from '@/admin/data/mockConfig'

interface AdminSettingsStore {
  settings: SystemSettings
  auditLogs: AuditLog[]

  updateSettings: (updates: Partial<SystemSettings>) => void
  toggleWidget: (widgetId: string) => void
  reorderWidgets: (widgets: DashboardWidget[]) => void
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
}

export const useAdminSettingsStore = create<AdminSettingsStore>()(
  persist(
    (set) => ({
      settings: { ...defaultSettings },
      auditLogs: [...mockAuditLogs],

      updateSettings: (updates) => {
        set((s) => ({ settings: { ...s.settings, ...updates } }))
      },

      toggleWidget: (widgetId) => {
        set((s) => ({
          settings: {
            ...s.settings,
            dashboardWidgets: s.settings.dashboardWidgets.map((w) =>
              w.id === widgetId ? { ...w, visible: !w.visible } : w
            ),
          },
        }))
      },

      reorderWidgets: (widgets) => {
        set((s) => ({
          settings: { ...s.settings, dashboardWidgets: widgets },
        }))
      },

      addAuditLog: (log) => {
        const entry: AuditLog = {
          ...log,
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        set((s) => ({ auditLogs: [entry, ...s.auditLogs].slice(0, 200) }))
      },
    }),
    {
      name: 'nwc-admin-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
