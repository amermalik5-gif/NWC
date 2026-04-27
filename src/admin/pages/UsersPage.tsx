import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { AdminHeader } from '@/admin/components/layout/AdminHeader'
import { AdminPageWrapper } from '@/admin/components/common/AdminPageWrapper'
import { RoleBadge } from '@/admin/components/common/RoleBadge'
import { StatusDot } from '@/admin/components/common/StatusDot'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAdminUsersStore } from '@/admin/store/adminUsersStore'
import { formatDate } from '@/lib/formatters'
import type { AdminUser, UserRole } from '@/admin/types'

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'team_member', label: 'Team Member' },
  { value: 'viewer', label: 'Viewer' },
]

const EMPTY_FORM = {
  name: '', username: '', email: '', password: '',
  role: 'team_member' as UserRole,
  status: 'active' as 'active' | 'inactive',
  department: '',
}

export function UsersPage() {
  const { users, addUser, updateUser, deleteUser, toggleStatus } = useAdminUsersStore()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [formError, setFormError] = useState('')

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  function openAdd() {
    setEditTarget(null)
    setForm({ ...EMPTY_FORM })
    setFormError('')
    setDialogOpen(true)
  }

  function openEdit(user: AdminUser) {
    setEditTarget(user)
    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password ?? '',
      role: user.role,
      status: user.status,
      department: user.department ?? '',
    })
    setFormError('')
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      setFormError('Name, username, and email are required.')
      return
    }
    if (!editTarget && !form.password.trim()) {
      setFormError('Password is required for new users.')
      return
    }
    if (editTarget) {
      await updateUser(editTarget.id, {
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
        status: form.status,
        department: form.department,
        ...(form.password.trim() ? { password: form.password.trim() } : {}),
      })
    } else {
      await addUser({ ...form })
    }
    setDialogOpen(false)
  }

  return (
    <>
      <AdminHeader
        title="User Management"
        subtitle={`${users.length} users total`}
        actions={
          <Button size="sm" onClick={openAdd} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        }
      />
      <AdminPageWrapper>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-4 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search name, username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  {['ID', 'Name', 'Username', 'Email', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-slate-300" />
                        <p className="text-sm text-slate-400">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{user.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span className="font-medium text-slate-700">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-mono">{user.username}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{user.email}</td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{user.department ?? '—'}</td>
                      <td className="px-4 py-3"><StatusDot active={user.status === 'active'} /></td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {user.lastLogin ? formatDate(user.lastLogin, 'MMM d, yyyy') : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(user)}>
                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => { void toggleStatus(user.id) }}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active'
                              ? <ToggleRight className="h-4 w-4 text-green-500" />
                              : <ToggleLeft className="h-4 w-4 text-slate-400" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setDeleteTarget(user)}
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4 py-2 text-xs text-slate-400">
            Showing {filtered.length} of {users.length} users
          </div>
        </Card>
      </AdminPageWrapper>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editTarget ? `Editing ${editTarget.name}` : 'Fill in the details for the new user.'}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <p className="text-xs text-red-500 rounded bg-red-50 border border-red-200 px-3 py-2">{formError}</p>
          )}

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name *</Label>
                <Input className="mt-1" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <Label>Username *</Label>
                <Input className="mt-1" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="username" />
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@company.com" />
            </div>
            <div>
              <Label>{editTarget ? 'Password (leave blank to keep current)' : 'Password *'}</Label>
              <Input
                className="mt-1"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder={editTarget ? 'Enter new password to change...' : 'Set a password'}
                autoComplete="new-password"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as UserRole }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'active' | 'inactive' }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Department</Label>
              <Input className="mt-1" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} placeholder="e.g. Creative" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
              {editTarget ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user?"
        description={`This will permanently remove "${deleteTarget?.name}" from the system.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleteTarget) await deleteUser(deleteTarget.id)
          setDeleteTarget(null)
        }}
      />
    </>
  )
}
