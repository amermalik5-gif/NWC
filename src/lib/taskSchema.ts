import { z } from 'zod'

const SERVICE_TYPE_VALUES = [
  'presentation_design',
  'presentation_translation',
  'graphic_design',
  'content_writing',
  'event_management',
] as const

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().default(''),
  requestSource: z.enum([
    'vp_office',
    'infrastructure',
    'it_operations',
    'digital_transformation',
    'strategy',
    'applications',
    'others',
  ]),
  serviceTypes: z
    .array(z.enum(SERVICE_TYPE_VALUES))
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
