import { useState } from 'react'
import { Plus, Pencil, Trash2, Lock, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ConfigItem, ConfigCategory } from '@/admin/types'

interface ConfigTableProps {
  category: ConfigCategory
  items: ConfigItem[]
  onAdd: (data: Omit<ConfigItem, 'id' | 'isSystem'>) => void
  onUpdate: (id: string, updates: Partial<ConfigItem>) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
  categoryLabel: string
}

interface ItemFormState {
  label: string
  value: string
  color: string
}

const EMPTY_FORM: ItemFormState = { label: '', value: '', color: '#6366f1' }

function toSlug(str: string) {
  return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
}

export function ConfigTable({
  category, items, onAdd, onUpdate, onDelete, onToggleActive, categoryLabel,
}: ConfigTableProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ConfigItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ConfigItem | null>(null)
  const [form, setForm] = useState<ItemFormState>(EMPTY_FORM)
  const [editForm, setEditForm] = useState<ItemFormState>(EMPTY_FORM)

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setAddOpen(true)
  }

  const openEdit = (item: ConfigItem) => {
    setEditForm({ label: item.label, value: item.value, color: item.color })
    setEditTarget(item)
  }

  const handleAdd = () => {
    if (!form.label.trim()) return
    const value = form.value.trim() || toSlug(form.label)
    onAdd({
      label: form.label.trim(),
      value,
      color: form.color,
      isActive: true,
      order: items.length + 1,
      category,
    })
    setAddOpen(false)
    setForm(EMPTY_FORM)
  }

  const handleUpdate = () => {
    if (!editTarget || !editForm.label.trim()) return
    onUpdate(editTarget.id, {
      label: editForm.label.trim(),
      value: editForm.value.trim() || toSlug(editForm.label),
      color: editForm.color,
    })
    setEditTarget(null)
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={openAdd} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-1" />Add {categoryLabel}
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                {['Color', 'Label', 'Value / Key', 'Order', 'Status', 'Type', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block h-5 w-5 rounded-full border border-slate-200 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{item.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.value}</td>
                  <td className="px-4 py-3 text-slate-500">{item.order}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        item.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                      )}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {item.isSystem ? (
                      <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 text-blue-600 gap-1">
                        <Lock className="h-3 w-3" />System
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-slate-200 text-slate-400">
                        Custom
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => onToggleActive(item.id)}
                      >
                        {item.isActive
                          ? <ToggleRight className="h-4 w-4 text-emerald-500" />
                          : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Edit"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-500" />
                      </Button>
                      {!item.isSystem && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Delete"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                    No items yet. Click "Add {categoryLabel}" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t px-4 py-2 text-xs text-slate-400">
          {items.length} {items.length === 1 ? 'item' : 'items'} · {items.filter((i) => i.isActive).length} active
        </div>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add {categoryLabel}</DialogTitle>
            <DialogDescription>Create a new {categoryLabel.toLowerCase()} option.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Label <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1"
                placeholder="e.g. HR Department"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm">Value / Key</Label>
              <Input
                className="mt-1 font-mono text-sm"
                placeholder={form.label ? toSlug(form.label) : 'auto-generated from label'}
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              />
              <p className="mt-1 text-xs text-slate-400">Leave blank to auto-generate from label.</p>
            </div>
            <div>
              <Label className="text-sm">Color</Label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  className="h-9 w-16 cursor-pointer rounded border border-slate-300 p-0.5"
                />
                <span className="font-mono text-sm text-slate-500">{form.color}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAdd}
              disabled={!form.label.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Add {categoryLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit {categoryLabel}</DialogTitle>
            <DialogDescription>Update the details for this item.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Label <span className="text-red-500">*</span></Label>
              <Input
                className="mt-1"
                value={editForm.label}
                onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm">Value / Key</Label>
              <Input
                className="mt-1 font-mono text-sm"
                value={editForm.value}
                onChange={(e) => setEditForm((f) => ({ ...f, value: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-sm">Color</Label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={editForm.color}
                  onChange={(e) => setEditForm((f) => ({ ...f, color: e.target.value }))}
                  className="h-9 w-16 cursor-pointer rounded border border-slate-300 p-0.5"
                />
                <span className="font-mono text-sm text-slate-500">{editForm.color}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button
              onClick={handleUpdate}
              disabled={!editForm.label.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.label}"?`}
        description="This item will be permanently removed. Tasks using this value will not be affected."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
