import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_USERS = [
  { id: 'USR-001', username: 'amerrawahneh', password: 'Rawahneh97', name: 'Amer Rawahneh', email: 'amer.rawahneh@company.com', role: 'admin', status: 'active', department: 'IT', createdAt: '2025-01-01T08:00:00Z', lastLogin: '2026-04-14T09:30:00Z' },
  { id: 'USR-002', username: 'sara.mohammed', password: 'Sara@2025', name: 'Sara Mohammed', email: 'sara.mohammed@company.com', role: 'manager', status: 'active', department: 'Creative', createdAt: '2025-01-05T08:00:00Z', lastLogin: '2026-04-13T14:20:00Z' },
  { id: 'USR-003', username: 'ahmed.alrashid', password: 'Ahmed@2025', name: 'Ahmed Al-Rashid', email: 'ahmed.alrashid@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2025-01-10T08:00:00Z', lastLogin: '2026-04-12T11:00:00Z' },
  { id: 'USR-004', username: 'khalid.ibrahim', password: 'Khalid@2025', name: 'Khalid Ibrahim', email: 'khalid.ibrahim@company.com', role: 'team_member', status: 'active', department: 'Design', createdAt: '2025-01-15T08:00:00Z', lastLogin: '2026-04-11T09:00:00Z' },
  { id: 'USR-005', username: 'nour.hassan', password: 'Nour@2025', name: 'Nour Hassan', email: 'nour.hassan@company.com', role: 'team_member', status: 'active', department: 'Translation', createdAt: '2025-02-01T08:00:00Z', lastLogin: '2026-04-10T16:00:00Z' },
  { id: 'USR-006', username: 'omar.abdullah', password: 'Omar@2025', name: 'Omar Abdullah', email: 'omar.abdullah@company.com', role: 'team_member', status: 'active', department: 'Content', createdAt: '2025-02-10T08:00:00Z', lastLogin: '2026-04-09T10:30:00Z' },
  { id: 'USR-007', username: 'lina.farid', password: 'Lina@2025', name: 'Lina Farid', email: 'lina.farid@company.com', role: 'team_member', status: 'active', department: 'Design', createdAt: '2025-02-15T08:00:00Z', lastLogin: '2026-04-08T13:00:00Z' },
  { id: 'USR-008', username: 'maya.yousef', password: 'Maya@2025', name: 'Maya Yousef', email: 'maya.yousef@company.com', role: 'team_member', status: 'active', department: 'Events', createdAt: '2025-03-01T08:00:00Z', lastLogin: '2026-04-07T15:45:00Z' },
  { id: 'USR-009', username: 'faisal.alamin', password: 'Faisal@2025', name: 'Faisal Al-Amin', email: 'faisal.alamin@company.com', role: 'viewer', status: 'active', department: 'Strategy', createdAt: '2025-03-10T08:00:00Z', lastLogin: '2026-04-05T11:00:00Z' },
  { id: 'USR-010', username: 'rania.kareem', password: 'Rania@2025', name: 'Rania Kareem', email: 'rania.kareem@company.com', role: 'team_member', status: 'inactive', department: 'Content', createdAt: '2025-03-20T08:00:00Z', lastLogin: '2026-03-15T09:00:00Z' },
  { id: 'USR-011', username: 'mansour', password: 'Mansour@2025', name: 'Mansour', email: 'mansour@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-012', username: 'areej', password: 'Areej@2025', name: 'Areej', email: 'areej@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-013', username: 'najah', password: 'Najah@2025', name: 'Najah', email: 'najah@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-014', username: 'team', password: 'Team@2025', name: 'Team', email: 'team@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
]

const INITIAL_CONFIG = {
  sources: [
    { id: 'src-1', value: 'vp_office', label: 'VP Office', color: '#3b82f6', isActive: true, isSystem: true, order: 1, category: 'source' },
    { id: 'src-2', value: 'infrastructure', label: 'Infrastructure', color: '#8b5cf6', isActive: true, isSystem: true, order: 2, category: 'source' },
    { id: 'src-3', value: 'it_operations', label: 'IT Operations', color: '#ec4899', isActive: true, isSystem: true, order: 3, category: 'source' },
    { id: 'src-4', value: 'digital_transformation', label: 'Digital Transformation', color: '#f59e0b', isActive: true, isSystem: true, order: 4, category: 'source' },
    { id: 'src-5', value: 'strategy', label: 'Strategy', color: '#10b981', isActive: true, isSystem: true, order: 5, category: 'source' },
    { id: 'src-6', value: 'applications', label: 'Applications', color: '#6366f1', isActive: true, isSystem: true, order: 6, category: 'source' },
    { id: 'src-7', value: 'others', label: 'Others', color: '#94a3b8', isActive: true, isSystem: true, order: 7, category: 'source' },
  ],
  services: [
    { id: 'svc-1', value: 'presentation_design', label: 'Presentation Design', color: '#3b82f6', isActive: true, isSystem: true, order: 1, category: 'service' },
    { id: 'svc-2', value: 'presentation_translation', label: 'Presentation Translation', color: '#8b5cf6', isActive: true, isSystem: true, order: 2, category: 'service' },
    { id: 'svc-3', value: 'graphic_design', label: 'Graphic Design', color: '#f59e0b', isActive: true, isSystem: true, order: 3, category: 'service' },
    { id: 'svc-4', value: 'content_writing', label: 'Content Writing', color: '#10b981', isActive: true, isSystem: true, order: 4, category: 'service' },
    { id: 'svc-5', value: 'event_management', label: 'Event Management & Meeting Coordination', color: '#ec4899', isActive: true, isSystem: true, order: 5, category: 'service' },
  ],
  statuses: [
    { id: 'sts-1', value: 'new', label: 'New', color: '#94a3b8', isActive: true, isSystem: true, order: 1, category: 'status' },
    { id: 'sts-2', value: 'in_progress', label: 'In Progress', color: '#f59e0b', isActive: true, isSystem: true, order: 2, category: 'status' },
    { id: 'sts-3', value: 'on_hold', label: 'On Hold', color: '#f97316', isActive: true, isSystem: true, order: 3, category: 'status' },
    { id: 'sts-4', value: 'blocked', label: 'Blocked', color: '#e11d48', isActive: true, isSystem: true, order: 4, category: 'status' },
    { id: 'sts-5', value: 'completed', label: 'Completed', color: '#10b981', isActive: true, isSystem: true, order: 5, category: 'status' },
    { id: 'sts-6', value: 'cancelled', label: 'Cancelled', color: '#ef4444', isActive: true, isSystem: true, order: 6, category: 'status' },
  ],
  priorities: [
    { id: 'pri-1', value: 'low', label: 'Low', color: '#94a3b8', isActive: true, isSystem: true, order: 1, category: 'priority' },
    { id: 'pri-2', value: 'medium', label: 'Medium', color: '#3b82f6', isActive: true, isSystem: true, order: 2, category: 'priority' },
    { id: 'pri-3', value: 'high', label: 'High', color: '#f97316', isActive: true, isSystem: true, order: 3, category: 'priority' },
    { id: 'pri-4', value: 'urgent', label: 'Urgent', color: '#ef4444', isActive: true, isSystem: true, order: 4, category: 'priority' },
  ],
}

// ─── In-memory database (shared by all connected clients) ─────────────────────
const db = {
  tasks: [],
  users: INITIAL_USERS.map(u => ({ ...u })),
  config: JSON.parse(JSON.stringify(INITIAL_CONFIG)),
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function generateTaskId() {
  const max = db.tasks.reduce((acc, t) => {
    const n = parseInt(t.id.replace('TASK-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `TASK-${String(max + 1).padStart(3, '0')}`
}

function generateUserId() {
  const max = db.users.reduce((acc, u) => {
    const n = parseInt(u.id.replace('USR-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `USR-${String(max + 1).padStart(3, '0')}`
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.users.find(u =>
    u.username.toLowerCase() === (username ?? '').toLowerCase() &&
    u.password === password &&
    u.status === 'active'
  )
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' })
  res.json({
    token: `mock-jwt-${Date.now()}`,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  })
})

app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.users.find(u =>
    u.username.toLowerCase() === (username ?? '').toLowerCase() &&
    u.password === password &&
    u.status === 'active' &&
    (u.role === 'admin' || u.role === 'manager')
  )
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' })
  res.json({
    token: `mock-admin-jwt-${Date.now()}`,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  })
})

// ─── Tasks API ────────────────────────────────────────────────────────────────
app.get('/api/tasks', (_req, res) => res.json(db.tasks))

app.get('/api/tasks/:id', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
})

app.post('/api/tasks', (req, res) => {
  const now = new Date().toISOString()
  const task = { ...req.body, id: generateTaskId(), createdAt: now, updatedAt: now }
  db.tasks = [task, ...db.tasks]
  res.status(201).json(task)
})

app.put('/api/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Task not found' })
  db.tasks[idx] = { ...db.tasks[idx], ...req.body, updatedAt: new Date().toISOString() }
  res.json(db.tasks[idx])
})

app.delete('/api/tasks/:id', (req, res) => {
  db.tasks = db.tasks.filter(t => t.id !== req.params.id)
  res.json({ ok: true })
})

// ─── Users API ────────────────────────────────────────────────────────────────
app.get('/api/users', (_req, res) => res.json(db.users))

app.post('/api/users', (req, res) => {
  const user = { ...req.body, id: generateUserId(), createdAt: new Date().toISOString(), lastLogin: null }
  db.users = [...db.users, user]
  res.status(201).json(user)
})

app.put('/api/users/:id', (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'User not found' })
  db.users[idx] = { ...db.users[idx], ...req.body }
  res.json(db.users[idx])
})

app.delete('/api/users/:id', (req, res) => {
  db.users = db.users.filter(u => u.id !== req.params.id)
  res.json({ ok: true })
})

// ─── Config API ───────────────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => res.json(db.config))

app.put('/api/config', (req, res) => {
  db.config = { ...db.config, ...req.body }
  res.json(db.config)
})

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
