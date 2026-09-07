import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// ─── Data file path (persists across restarts) ────────────────────────────────
const DATA_FILE = join(__dirname, 'data.json')

// ─── Simple password hashing (SHA-256, no external deps needed at runtime) ───
function hashPassword(plain) {
  return createHash('sha256').update(plain + 'nwc-salt-2025').digest('hex')
}

function verifyPassword(plain, hashed) {
  return hashPassword(plain) === hashed
}

// ─── Initial data ─────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 'USR-001', username: 'amerrawahneh', password: hashPassword('Rawahneh97'), name: 'Amer Rawahneh', email: 'amer.rawahneh@company.com', role: 'admin', status: 'active', department: 'IT', createdAt: '2025-01-01T08:00:00Z', lastLogin: '2026-04-14T09:30:00Z' },
  { id: 'USR-002', username: 'sara.mohammed', password: hashPassword('Sara@2025'), name: 'Sara Mohammed', email: 'sara.mohammed@company.com', role: 'manager', status: 'active', department: 'Creative', createdAt: '2025-01-05T08:00:00Z', lastLogin: '2026-04-13T14:20:00Z' },
  { id: 'USR-003', username: 'ahmed.alrashid', password: hashPassword('Ahmed@2025'), name: 'Ahmed Al-Rashid', email: 'ahmed.alrashid@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2025-01-10T08:00:00Z', lastLogin: '2026-04-12T11:00:00Z' },
  { id: 'USR-004', username: 'khalid.ibrahim', password: hashPassword('Khalid@2025'), name: 'Khalid Ibrahim', email: 'khalid.ibrahim@company.com', role: 'team_member', status: 'active', department: 'Design', createdAt: '2025-01-15T08:00:00Z', lastLogin: '2026-04-11T09:00:00Z' },
  { id: 'USR-005', username: 'nour.hassan', password: hashPassword('Nour@2025'), name: 'Nour Hassan', email: 'nour.hassan@company.com', role: 'team_member', status: 'active', department: 'Translation', createdAt: '2025-02-01T08:00:00Z', lastLogin: '2026-04-10T16:00:00Z' },
  { id: 'USR-006', username: 'omar.abdullah', password: hashPassword('Omar@2025'), name: 'Omar Abdullah', email: 'omar.abdullah@company.com', role: 'team_member', status: 'active', department: 'Content', createdAt: '2025-02-10T08:00:00Z', lastLogin: '2026-04-09T10:30:00Z' },
  { id: 'USR-007', username: 'lina.farid', password: hashPassword('Lina@2025'), name: 'Lina Farid', email: 'lina.farid@company.com', role: 'team_member', status: 'active', department: 'Design', createdAt: '2025-02-15T08:00:00Z', lastLogin: '2026-04-08T13:00:00Z' },
  { id: 'USR-008', username: 'maya.yousef', password: hashPassword('Maya@2025'), name: 'Maya Yousef', email: 'maya.yousef@company.com', role: 'team_member', status: 'active', department: 'Events', createdAt: '2025-03-01T08:00:00Z', lastLogin: '2026-04-07T15:45:00Z' },
  { id: 'USR-009', username: 'faisal.alamin', password: hashPassword('Faisal@2025'), name: 'Faisal Al-Amin', email: 'faisal.alamin@company.com', role: 'viewer', status: 'active', department: 'Strategy', createdAt: '2025-03-10T08:00:00Z', lastLogin: '2026-04-05T11:00:00Z' },
  { id: 'USR-010', username: 'rania.kareem', password: hashPassword('Rania@2025'), name: 'Rania Kareem', email: 'rania.kareem@company.com', role: 'team_member', status: 'inactive', department: 'Content', createdAt: '2025-03-20T08:00:00Z', lastLogin: '2026-03-15T09:00:00Z' },
  { id: 'USR-011', username: 'mansour', password: hashPassword('Mansour@2025'), name: 'Mansour', email: 'mansour@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-012', username: 'areej', password: hashPassword('Areej@2025'), name: 'Areej', email: 'areej@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-013', username: 'najah', password: hashPassword('Najah@2025'), name: 'Najah', email: 'najah@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-014', username: 'team', password: hashPassword('Team@2025'), name: 'Team', email: 'team@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
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

// ─── Persistent database (loads from file, saves on every change) ─────────────
function loadDb() {
  if (existsSync(DATA_FILE)) {
    try {
      const raw = readFileSync(DATA_FILE, 'utf-8')
      const saved = JSON.parse(raw)
      console.log(`✅ Loaded data from ${DATA_FILE} (${saved.tasks?.length ?? 0} tasks, ${saved.users?.length ?? 0} users)`)
      // Merge: always keep saved data, but if no users exist fall back to initial
      return {
        tasks: saved.tasks ?? [],
        users: saved.users?.length ? saved.users : INITIAL_USERS,
        config: saved.config ?? JSON.parse(JSON.stringify(INITIAL_CONFIG)),
      }
    } catch (e) {
      console.warn('⚠️  Could not parse data file, starting fresh:', e.message)
    }
  } else {
    console.log('📁 No data file found — starting with initial data')
  }
  return {
    tasks: [],
    users: INITIAL_USERS.map(u => ({ ...u })),
    config: JSON.parse(JSON.stringify(INITIAL_CONFIG)),
  }
}

function saveDb() {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8')
  } catch (e) {
    console.error('❌ Failed to save data:', e.message)
  }
}

const db = loadDb()

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// ─── Auth API ─────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.users.find(u =>
    u.username.toLowerCase() === (username ?? '').toLowerCase() &&
    verifyPassword(password, u.password) &&
    u.status === 'active'
  )
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' })

  // Update last login
  user.lastLogin = new Date().toISOString()
  saveDb()

  res.json({
    token: `mock-jwt-${Date.now()}`,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  })
})

app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.users.find(u =>
    u.username.toLowerCase() === (username ?? '').toLowerCase() &&
    verifyPassword(password, u.password) &&
    u.status === 'active' &&
    (u.role === 'admin' || u.role === 'manager')
  )
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' })

  user.lastLogin = new Date().toISOString()
  saveDb()

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
  saveDb()
  res.status(201).json(task)
})

app.put('/api/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Task not found' })
  db.tasks[idx] = { ...db.tasks[idx], ...req.body, updatedAt: new Date().toISOString() }
  saveDb()
  res.json(db.tasks[idx])
})

app.delete('/api/tasks/:id', (req, res) => {
  db.tasks = db.tasks.filter(t => t.id !== req.params.id)
  saveDb()
  res.json({ ok: true })
})

// ─── Users API ────────────────────────────────────────────────────────────────
app.get('/api/users', (_req, res) => {
  // Never expose hashed passwords to the client
  const safe = db.users.map(({ password: _p, ...u }) => u)
  res.json(safe)
})

app.post('/api/users', (req, res) => {
  const { password, ...rest } = req.body
  const user = {
    ...rest,
    password: password ? hashPassword(password) : hashPassword('ChangeMe@2025'),
    id: generateUserId(),
    createdAt: new Date().toISOString(),
    lastLogin: null,
  }
  db.users = [...db.users, user]
  saveDb()
  const { password: _p, ...safeUser } = user
  res.status(201).json(safeUser)
})

app.put('/api/users/:id', (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'User not found' })
  const { password, ...rest } = req.body
  const update = { ...rest }
  if (password) update.password = hashPassword(password)
  db.users[idx] = { ...db.users[idx], ...update }
  saveDb()
  const { password: _p, ...safeUser } = db.users[idx]
  res.json(safeUser)
})

app.delete('/api/users/:id', (req, res) => {
  db.users = db.users.filter(u => u.id !== req.params.id)
  saveDb()
  res.json({ ok: true })
})

// ─── Config API ───────────────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => res.json(db.config))

app.put('/api/config', (req, res) => {
  db.config = { ...db.config, ...req.body }
  saveDb()
  res.json(db.config)
})

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
