# API Contract

When `VITE_USE_MOCK_DATA=false`, the app calls a REST API at `VITE_API_BASE_URL`.  
Swap `src/services/taskService.ts` with `src/services/taskService.api.ts` (keep identical signatures).

---

## Endpoints

### GET /tasks
Returns paginated, filtered task list.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `search` | string | Keyword search |
| `requestSource` | string | One of the 7 sources, or omit for all |
| `serviceType` | string | One of the 5 service types, or omit for all |
| `status` | string | `new` / `in_progress` / `on_hold` / `completed` / `cancelled` |
| `priority` | string | `low` / `medium` / `high` / `urgent` |
| `assignedTo` | string | Exact name match |
| `dateRangeStart` | ISO date | Filter by dueDate >= value |
| `dateRangeEnd` | ISO date | Filter by dueDate <= value |
| `page` | number | 1-indexed, default 1 |
| `pageSize` | number | Default 20 |

**Response:**
```json
{
  "data": [Task],
  "total": 50,
  "page": 1,
  "pageSize": 20
}
```

---

### GET /tasks/:id
Returns a single task or 404.

**Response:** `Task`

---

### POST /tasks
Creates a new task.

**Body:** `CreateTaskInput` (Task without `id`, `createdAt`, `updatedAt`)

**Response:** `Task` (with generated `id`)

---

### PATCH /tasks/:id
Partial update of a task.

**Body:** `UpdateTaskInput` (partial `CreateTaskInput`)

**Response:** Updated `Task`

---

### DELETE /tasks/:id
Deletes a task.

**Response:** `204 No Content`

---

### GET /tasks/stats (optional optimisation)
Returns pre-aggregated stats. If not available, the client derives stats from GET /tasks.

**Query params:** same filter params as GET /tasks

**Response:** `TaskStats` (see `src/types/chart.ts`)

---

## Task Object Shape

```typescript
{
  id: string                  // "TASK-001"
  title: string
  description: string
  requestSource: 'vp_office' | 'infrastructure' | 'it_operations' | 'digital_transformation' | 'strategy' | 'applications' | 'others'
  serviceType: 'presentation_design' | 'presentation_translation' | 'graphic_design' | 'content_writing' | 'event_management'
  requesterName: string
  assignedTo: string
  status: 'new' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestDate: string         // ISO date "2026-01-15"
  startDate: string | null
  dueDate: string
  completionDate: string | null
  notes: string
  attachments: TaskAttachment[]
  createdAt: string           // ISO datetime
  updatedAt: string
}
```
