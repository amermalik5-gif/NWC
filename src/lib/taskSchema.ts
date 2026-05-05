import { z } from 'zod'

const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
})

const recurringSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  interval: z.number().min(1),
  endDate: z.string().nullable().optional(),
}).nullable()

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().default(''),
  requestSource: z.string().min(1, 'Request source is required'),
  serviceTypes: z
    .array(z.string().min(1))
    .min(1, 'Select at least one service type'),
  requesterName: z.string().min(1, 'Requester name is required'),
  assignedTo: z.string().min(1, 'Please assign to a team member'),
  status: z.enum(['new', 'in_progress', 'on_hold', 'blocked', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  blocker: z.string().nullable().default(null),
  requestDate: z.string().min(1, 'Request date is required'),
  startDate: z.string().nullable().default(null),
  dueDate: z.string().min(1, 'Due date is required'),
  completionDate: z.string().nullable().default(null),
  notes: z.string().default(''),
  attachments: z.array(z.any()).default([]),
  checklist: z.array(checklistItemSchema).default([]),
  recurring: recurringSchema.default(null),
  templateId: z.string().nullable().default(null),
}).superRefine((data, ctx) => {
  if (data.status === 'blocked' && (!data.blocker || data.blocker.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Blocker reason is required when status is Blocked',
      path: ['blocker'],
    })
  }
})

export type TaskFormValues = z.infer<typeof taskSchema>
