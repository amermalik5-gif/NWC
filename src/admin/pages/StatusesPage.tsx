import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { ConfigTable } from '@/admin/components/common/ConfigTable'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'

export function StatusesPage() {
  const { statuses, addItem, updateItem, deleteItem, toggleActive } = useAdminConfigStore()

  return (
    <>
      <AdminHeader
        title="Task Statuses"
        subtitle="Manage the lifecycle statuses for tasks"
      />
      <AdminPageWrapper>
        <div className="rounded-lg border bg-amber-50 border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Note:</strong> Changing a status value key may affect existing task data. It is recommended to only edit labels and colors for system statuses.
        </div>
        <ConfigTable
          category="status"
          items={statuses}
          onAdd={(data) => addItem('status', data)}
          onUpdate={(id, updates) => updateItem('status', id, updates)}
          onDelete={(id) => deleteItem('status', id)}
          onToggleActive={(id) => toggleActive('status', id)}
          categoryLabel="Status"
        />
      </AdminPageWrapper>
    </>
  )
}
