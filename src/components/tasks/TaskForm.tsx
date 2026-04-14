import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateTask, useUpdateTask } from '@/hooks/useTaskMutations'
import { useToast } from '@/hooks/useToast'
import { taskSchema, type TaskFormValues } from '@/lib/taskSchema'
import { useConfigOptions } from '@/hooks/useConfigOptions'
import { MOCK_USERS } from '@/data/mock/users'
import { taskDetailPath, ROUTES } from '@/constants/routes'
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
  serviceType: 'presentation_design',
  requesterName: '',
  assignedTo: '',
  status: 'new',
  priority: 'medium',
  requestDate: new Date().toISOString().split('T')[0],
  startDate: null,
  dueDate: '',
  completionDate: null,
  notes: '',
  attachments: [],
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
  const { REQUEST_SOURCES, SERVICE_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS } = useConfigOptions()

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

  const onSubmit = async (data: TaskFormValues) => {
    if (mode === 'create') {
      createTask.mutate(
        { ...data, attachments: [] },
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
        { id: taskId, input: data },
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
              <Select
                value={watch('requestSource')}
                onValueChange={(v) => setValue('requestSource', v as TaskFormValues['requestSource'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Service Type <span className="text-red-500">*</span></Label>
              <Select
                value={watch('serviceType')}
                onValueChange={(v) => setValue('serviceType', v as TaskFormValues['serviceType'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                value={watch('assignedTo')}
                onValueChange={(v) => setValue('assignedTo', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_USERS.map((user) => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
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
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(v) => setValue('status', v as TaskFormValues['status'])}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select
              value={watch('priority')}
              onValueChange={(v) => setValue('priority', v as TaskFormValues['priority'])}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
              className="mt-1"
              onChange={(e) => setValue('startDate', e.target.value || null)}
            />
          </div>
          <div>
            <Label htmlFor="completionDate">Completion Date</Label>
            <Input
              id="completionDate"
              type="date"
              {...register('completionDate')}
              className="mt-1"
              onChange={(e) => setValue('completionDate', e.target.value || null)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register('notes')}
            placeholder="Additional notes or context..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting || createTask.isPending || updateTask.isPending}>
          {isSubmitting || createTask.isPending || updateTask.isPending
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Task'
            : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
