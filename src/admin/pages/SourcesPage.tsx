import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { ConfigTable } from '@/admin/components/common/ConfigTable'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'

export function SourcesPage() {
  const { sources, addItem, updateItem, deleteItem, toggleActive } = useAdminConfigStore()

  return (
    <>
      <AdminHeader
        title="Request Sources"
        subtitle="Manage the departments and teams that submit requests"
      />
      <AdminPageWrapper>
        <div className="rounded-lg border bg-amber-50 border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Note:</strong> System items (marked with a lock icon) cannot be deleted, but their labels and colors can be updated. Deactivated sources will no longer appear in new task forms.
        </div>
        <ConfigTable
          category="source"
          items={sources}
          onAdd={(data) => addItem('source', data)}
          onUpdate={(id, updates) => updateItem('source', id, updates)}
          onDelete={(id) => deleteItem('source', id)}
          onToggleActive={(id) => toggleActive('source', id)}
          categoryLabel="Source"
        />
      </AdminPageWrapper>
    </>
  )
}
