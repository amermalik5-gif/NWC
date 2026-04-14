import { z } from 'zod'

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
  serviceType: z.enum([
    'presentation_design',
    'presentation_translation',
    'graphic_design',
    'content_writing',
    'event_management',
  ]),
  requesterName: z.string().min(1, 'Requester name is required'),
  assignedTo: z.string().min(1, 'Please assign to a team member'),
  status: z.enum(['new', 'in_progress', 'on_hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  requestDate: z.string().min(1, 'Request date is required'),
  startDate: z.string().nullable().default(null),
  dueDate: z.string().min(1, 'Due date is required'),
  completionDate: z.string().nullable().default(null),
  notes: z.string().default(''),
  attachments: z.array(z.any()).default([]),
})

export type TaskFormValues = z.infer<typeof taskSchema>
