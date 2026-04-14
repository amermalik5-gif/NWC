import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { ConfigTable } from '@/admin/components/common/ConfigTable'
import { useAdminConfigStore } from '@/admin/store/adminConfigStore'

export function ServicesPage() {
  const { services, addItem, updateItem, deleteItem, toggleActive } = useAdminConfigStore()

  return (
    <>
      <AdminHeader
        title="Service Categories"
        subtitle="Manage the types of services your team provides"
      />
      <AdminPageWrapper>
        <div className="rounded-lg border bg-amber-50 border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Note:</strong> System items cannot be deleted. Deactivated services will not appear in new task creation forms.
        </div>
        <ConfigTable
          category="service"
          items={services}
          onAdd={(data) => addItem('service', data)}
          onUpdate={(id, updates) => updateItem('service', id, updates)}
          onDelete={(id) => deleteItem('service', id)}
          onToggleActive={(id) => toggleActive('service', id)}
          categoryLabel="Service"
        />
      </AdminPageWrapper>
    </>
  )
}
