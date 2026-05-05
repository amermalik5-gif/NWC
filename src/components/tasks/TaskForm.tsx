import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useCreateTask, useUpdateTask } from '@/hooks/useTaskMutations'
import { useToast } from '@/hooks/useToast'
import { useTemplates } from '@/hooks/useTemplates'
import { taskSchema, type TaskFormValues } from '@/lib/taskSchema'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { taskDetailPath, ROUTES } from '@/constants/routes'
import { TaskChecklistEditor } from './TaskChecklist'
import type { Task } from '@/types/task'

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>
  taskId?: string
  mode: 'create' | 'edit'
}

const CREATE_DEFAULTS: TaskFormValues = {
  title: '',
  description: '',
  requestSource: 'vp_office',
  serviceTypes: ['presentation_design'],
  requesterName: '',
  assignedTo: '',
  status: 'new',
  priority: 'medium',
  blocker: null,
  requestDate: new Date().toISOString().split('T')[0],
  startDate: null,
  dueDate: '',
  completionDate: null,
  notes: '',
  attachments: [],
  checklist: [],
  recurring: null,
  templateId: null,
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-1">{message}</p>
}

export function TaskForm({ defaultValues, taskId, mode }: TaskFormProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const { REQUEST_SOURCES, SERVICE_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS, ASSIGNEES } = useConfigOptions()
  const { data: templates = [] } = useTemplates()
  const [recurringEnabled, setRecurringEnabled] = useState(!!defaultValues?.recurring)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { ...CREATE_DEFAULTS, ...defaultValues },
  })

  const checklist = watch('checklist') ?? []
  const recurring = watch('recurring')

  const applyTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId)
    if (!tpl) return
    setValue('templateId', templateId)
    if (tpl.defaults.serviceTypes?.length) {
      setValue('serviceTypes', tpl.defaults.serviceTypes as TaskFormValues['serviceTypes'])
    }
    if (tpl.defaults.priority) setValue('priority', tpl.defaults.priority as TaskFormValues['priority'])
    if (tpl.defaults.status) setValue('status', tpl.defaults.status as TaskFormValues['status'])
    if (tpl.defaults.checklist) setValue('checklist', tpl.defaults.checklist)
    toast({ title: `Template applied: ${tpl.name}`, description: 'Fields pre-filled from template.' })
  }

  const onSubmit = async (data: TaskFormValues) => {
    const payload = {
      ...data,
      recurring: recurringEnabled ? data.recurring : null,
    }

    if (mode === 'create') {
      createTask.mutate(
        { ...payload, attachments: [] },
        {
          onSuccess: (task: Task) => {
            toast({ title: 'Task created', description: `${task.id} has been created.` })
            navigate(taskDetailPath(task.id))
          },
          onError: () => {
            toast({ title: 'Error', description: 'Failed to create task.', variant: 'destructive' })
          },
        }
      )
    } else if (taskId) {
      updateTask.mutate(
        { id: taskId, input: payload },
        {
          onSuccess: (task: Task) => {
            toast({ title: 'Task updated', description: `${task.id} has been saved.` })
            navigate(taskDetailPath(task.id))
          },
          onError: () => {
            toast({ title: 'Error', description: 'Failed to update task.', variant: 'destructive' })
          },
        }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Template selector — only on create */}
      {mode === 'create' && templates.length > 0 && (
        <Card className="border-nwc-muted bg-nwc-light">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm text-nwc-navy">
              <LayoutTemplate className="h-4 w-4" />
              Use a Template (optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl.id)}
                  className="rounded-lg border border-nwc-muted bg-white px-3 py-2 text-left text-sm hover:border-nwc-blue hover:bg-nwc-light transition-colors"
                >
                  <p className="font-medium text-nwc-navy">{tpl.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tpl.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Task Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input id="title" {...register('title')} className="mt-1" placeholder="Enter task title" />
            <FieldError message={errors.title?.message} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} className="mt-1" placeholder="Describe the task..." rows={3} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Request Source <span className="text-red-500">*</span></Label>
              <Select value={watch('requestSource')} onValueChange={(v) => setValue('requestSource', v as TaskFormValues['requestSource'])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REQUEST_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Service Type(s) <span className="text-red-500">*</span></Label>
              <MultiSelect
                className="mt-1"
                options={SERVICE_TYPES}
                value={watch('serviceTypes') ?? []}
                onChange={(v) => setValue('serviceTypes', v as TaskFormValues['serviceTypes'], { shouldValidate: true })}
                placeholder="Select service(s)..."
              />
              {errors.serviceTypes && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.serviceTypes.message ?? (errors.serviceTypes as any)?.root?.message ?? 'Select at least one service type'}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="requesterName">Requester Name <span className="text-red-500">*</span></Label>
              <Input id="requesterName" {...register('requesterName')} className="mt-1" placeholder="Who requested this?" />
              <FieldError message={errors.requesterName?.message} />
            </div>
            <div>
              <Label>Assigned To <span className="text-red-500">*</span></Label>
              <Select value={watch('assignedTo')} onValueChange={(v) => setValue('assignedTo', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select team member" /></SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
              <FieldError message={errors.assignedTo?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Priority */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Status & Priority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Status</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as TaskFormValues['status'], { shouldValidate: true })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={watch('priority')} onValueChange={(v) => setValue('priority', v as TaskFormValues['priority'])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {watch('status') === 'blocked' && (
            <div>
              <Label htmlFor="blocker">Blocker Reason <span className="text-red-500">*</span></Label>
              <Textarea id="blocker" {...register('blocker')} className="mt-1" placeholder="Describe what is blocking this task..." rows={3} />
              <FieldError message={errors.blocker?.message} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dates</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="requestDate">Request Date <span className="text-red-500">*</span></Label>
            <Input id="requestDate" type="date" {...register('requestDate')} className="mt-1" />
            <FieldError message={errors.requestDate?.message} />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
            <Input id="dueDate" type="date" {...register('dueDate')} className="mt-1" />
            <FieldError message={errors.dueDate?.message} />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register('startDate')} className="mt-1" onChange={(e) => setValue('startDate', e.target.value || null)} />
          </div>
          <div>
            <Label htmlFor="completionDate">Completion Date</Label>
            <Input id="completionDate" type="date" {...register('completionDate')} className="mt-1" onChange={(e) => setValue('completionDate', e.target.value || null)} />
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Checklist / Sub-tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskChecklistEditor
            items={checklist}
            onChange={(items) => setValue('checklist', items)}
          />
        </CardContent>
      </Card>

      {/* Recurring */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Recurring Task
            </div>
            <Switch
              checked={recurringEnabled}
              onCheckedChange={(v) => {
                setRecurringEnabled(v)
                if (v && !recurring) setValue('recurring', { frequency: 'weekly', interval: 1, endDate: null })
                if (!v) setValue('recurring', null)
              }}
            />
          </CardTitle>
        </CardHeader>
        {recurringEnabled && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label>Frequency</Label>
                <Select
                  value={recurring?.frequency ?? 'weekly'}
                  onValueChange={(v) => setValue('recurring', { ...(recurring ?? { interval: 1 }), frequency: v as any })}
                >
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Every</Label>
                <Input
                  type="number"
                  min={1}
                  max={52}
                  className="mt-1"
                  value={recurring?.interval ?? 1}
                  onChange={(e) => setValue('recurring', { ...(recurring ?? { frequency: 'weekly' }), interval: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="recurringEnd">End Date (optional)</Label>
                <Input
                  id="recurringEnd"
                  type="date"
                  className="mt-1"
                  value={recurring?.endDate ?? ''}
                  onChange={(e) => setValue('recurring', { ...(recurring ?? { frequency: 'weekly', interval: 1 }), endDate: e.target.value || null })}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register('notes')} placeholder="Additional notes or context..." rows={4} />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting || createTask.isPending || updateTask.isPending}>
          {isSubmitting || createTask.isPending || updateTask.isPending
            ? 'Saving...'
            : mode === 'create' ? 'Create Task' : 'Save Changes'
          }
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
