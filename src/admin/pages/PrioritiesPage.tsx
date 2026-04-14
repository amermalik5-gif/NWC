import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { ConfigTable } from '@/admin/components/common/ConfigTable'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'

export function PrioritiesPage() {
  const { priorities, addItem, updateItem, deleteItem, toggleActive } = useAdminConfigStore()

  return (
    <>
      <AdminHeader
        title="Priority Levels"
        subtitle="Manage task priority levels and their visual indicators"
      />
      <AdminPageWrapper>
        <div className="rounded-lg border bg-amber-50 border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Note:</strong> Changing a priority value key may affect existing task data. Only edit labels and colors for system priorities.
        </div>
        <ConfigTable
          category="priority"
          items={priorities}
          onAdd={(data) => addItem('priority', data)}
          onUpdate={(id, updates) => updateItem('priority', id, updates)}
          onDelete={(id) => deleteItem('priority', id)}
          onToggleActive={(id) => toggleActive('priority', id)}
          categoryLabel="Priority"
        />
      </AdminPageWrapper>
    </>
  )
}
