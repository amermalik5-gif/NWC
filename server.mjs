import express from 'express'
import pg from 'pg'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// ─── Database connection ───────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
})

// ─── SSE clients registry ─────────────────────────────────────────────────────
const sseClients = new Set()

function broadcastEvent(type, payload) {
  const data = JSON.stringify({ type, payload, ts: Date.now() })
  for (const res of sseClients) {
    try { res.write(`data: ${data}\n\n`) } catch (_) { sseClients.delete(res) }
  }
}

// ─── Initial seed data ─────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 'USR-001', username: 'amerrawahneh', password: 'Rawahneh97', name: 'Amer Rawahneh', email: 'amer.rawahneh@company.com', role: 'admin', status: 'active', department: 'IT' },
  { id: 'USR-002', username: 'sara.mohammed', password: 'Sara@2025', name: 'Sara Mohammed', email: 'sara.mohammed@company.com', role: 'manager', status: 'active', department: 'Creative' },
  { id: 'USR-003', username: 'ahmed.alrashid', password: 'Ahmed@2025', name: 'Ahmed Al-Rashid', email: 'ahmed.alrashid@company.com', role: 'team_member', status: 'active', department: 'Creative' },
  { id: 'USR-004', username: 'khalid.ibrahim', password: 'Khalid@2025', name: 'Khalid Ibrahim', email: 'khalid.ibrahim@company.com', role: 'team_member', status: 'active', department: 'Design' },
  { id: 'USR-005', username: 'nour.hassan', password: 'Nour@2025', name: 'Nour Hassan', email: 'nour.hassan@company.com', role: 'team_member', status: 'active', department: 'Translation' },
  { id: 'USR-006', username: 'omar.abdullah', password: 'Omar@2025', name: 'Omar Abdullah', email: 'omar.abdullah@company.com', role: 'team_member', status: 'active', department: 'Content' },
  { id: 'USR-007', username: 'lina.farid', password: 'Lina@2025', name: 'Lina Farid', email: 'lina.farid@company.com', role: 'team_member', status: 'active', department: 'Design' },
  { id: 'USR-008', username: 'maya.yousef', password: 'Maya@2025', name: 'Maya Yousef', email: 'maya.yousef@company.com', role: 'team_member', status: 'active', department: 'Events' },
  { id: 'USR-009', username: 'faisal.alamin', password: 'Faisal@2025', name: 'Faisal Al-Amin', email: 'faisal.alamin@company.com', role: 'viewer', status: 'active', department: 'Strategy' },
  { id: 'USR-010', username: 'rania.kareem', password: 'Rania@2025', name: 'Rania Kareem', email: 'rania.kareem@company.com', role: 'team_member', status: 'inactive', department: 'Content' },
  { id: 'USR-011', username: 'mansour', password: 'Mansour@2025', name: 'Mansour', email: 'mansour@company.com', role: 'team_member', status: 'active', department: 'Creative' },
  { id: 'USR-012', username: 'areej', password: 'Areej@2025', name: 'Areej', email: 'areej@company.com', role: 'team_member', status: 'active', department: 'Creative' },
  { id: 'USR-013', username: 'najah', password: 'Najah@2025', name: 'Najah', email: 'najah@company.com', role: 'team_member', status: 'active', department: 'Creative' },
  { id: 'USR-014', username: 'team', password: 'Team@2025', name: 'Team', email: 'team@company.com', role: 'team_member', status: 'active', department: 'Creative' },
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

const INITIAL_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Presentation Design Request',
    description: 'Standard request for designing a new presentation',
    defaults: {
      serviceTypes: ['presentation_design'],
      priority: 'medium',
      status: 'new',
      checklist: [
        { id: 'cl-1', text: 'Receive content from requester', completed: false },
        { id: 'cl-2', text: 'Apply brand template', completed: false },
        { id: 'cl-3', text: 'Internal review', completed: false },
        { id: 'cl-4', text: 'Deliver to requester', completed: false },
      ],
    },
  },
  {
    id: 'tpl-2',
    name: 'Presentation Translation',
    description: 'Translate an existing presentation to Arabic or English',
    defaults: {
      serviceTypes: ['presentation_translation'],
      priority: 'medium',
      status: 'new',
      checklist: [
        { id: 'cl-1', text: 'Receive source file', completed: false },
        { id: 'cl-2', text: 'Translate content', completed: false },
        { id: 'cl-3', text: 'Format & align layout', completed: false },
        { id: 'cl-4', text: 'Proofreading', completed: false },
        { id: 'cl-5', text: 'Deliver final file', completed: false },
      ],
    },
  },
  {
    id: 'tpl-3',
    name: 'Graphic Design Request',
    description: 'Create graphics, banners, or visual assets',
    defaults: {
      serviceTypes: ['graphic_design'],
      priority: 'medium',
      status: 'new',
      checklist: [
        { id: 'cl-1', text: 'Gather brief and requirements', completed: false },
        { id: 'cl-2', text: 'Initial concepts', completed: false },
        { id: 'cl-3', text: 'Revisions', completed: false },
        { id: 'cl-4', text: 'Final delivery', completed: false },
      ],
    },
  },
  {
    id: 'tpl-4',
    name: 'Event / Meeting Coordination',
    description: 'Plan and coordinate an internal event or meeting',
    defaults: {
      serviceTypes: ['event_management'],
      priority: 'high',
      status: 'new',
      checklist: [
        { id: 'cl-1', text: 'Confirm date, time, venue', completed: false },
        { id: 'cl-2', text: 'Send invitations', completed: false },
        { id: 'cl-3', text: 'Arrange catering/equipment', completed: false },
        { id: 'cl-4', text: 'Prepare agenda', completed: false },
        { id: 'cl-5', text: 'Post-event follow-up', completed: false },
      ],
    },
  },
  {
    id: 'tpl-5',
    name: 'Content Writing Request',
    description: 'Write or edit content for internal or external use',
    defaults: {
      serviceTypes: ['content_writing'],
      priority: 'medium',
      status: 'new',
      checklist: [
        { id: 'cl-1', text: 'Receive brief', completed: false },
        { id: 'cl-2', text: 'First draft', completed: false },
        { id: 'cl-3', text: 'Review & edits', completed: false },
        { id: 'cl-4', text: 'Final approval', completed: false },
      ],
    },
  },
]

// ─── Create tables and seed if empty ──────────────────────────────────────────
async function initDB() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS activity (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );
    `)

    // Seed users
    const { rowCount: userCount } = await client.query('SELECT 1 FROM users LIMIT 1')
    if (userCount === 0) {
      for (const user of INITIAL_USERS) {
        await client.query(
          'INSERT INTO users (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
          [user.id, { ...user, createdAt: new Date().toISOString(), lastLogin: null }]
        )
      }
      console.log('✅ Users seeded')
    }

    // Seed config
    const { rowCount: configCount } = await client.query("SELECT 1 FROM config WHERE key='main' LIMIT 1")
    if (configCount === 0) {
      await client.query(
        "INSERT INTO config (key, data) VALUES ('main', $1) ON CONFLICT (key) DO NOTHING",
        [INITIAL_CONFIG]
      )
      console.log('✅ Config seeded')
    }

    // Seed templates
    const { rowCount: tplCount } = await client.query('SELECT 1 FROM templates LIMIT 1')
    if (tplCount === 0) {
      for (const tpl of INITIAL_TEMPLATES) {
        await client.query(
          'INSERT INTO templates (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
          [tpl.id, tpl]
        )
      }
      console.log('✅ Templates seeded')
    }

    console.log('✅ Database ready')
  } finally {
    client.release()
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function generateTaskId() {
  const { rows } = await pool.query("SELECT id FROM tasks ORDER BY id DESC")
  const max = rows.reduce((acc, r) => {
    const n = parseInt(r.id.replace('TASK-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `TASK-${String(max + 1).padStart(3, '0')}`
}

async function generateUserId() {
  const { rows } = await pool.query("SELECT id FROM users ORDER BY id DESC")
  const max = rows.reduce((acc, r) => {
    const n = parseInt(r.id.replace('USR-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `USR-${String(max + 1).padStart(3, '0')}`
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

async function logActivity(taskId, authorName, action, field, oldValue, newValue) {
  const entry = {
    id: generateId('ACT'),
    taskId,
    authorName,
    action,
    field: field ?? null,
    oldValue: oldValue ?? null,
    newValue: newValue ?? null,
    createdAt: new Date().toISOString(),
  }
  await pool.query(
    'INSERT INTO activity (id, task_id, data) VALUES ($1, $2, $3)',
    [entry.id, taskId, entry]
  )
  return entry
}

// ─── SSE endpoint ─────────────────────────────────────────────────────────────
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
  sseClients.add(res)
  req.on('close', () => sseClients.delete(res))
})

// ─── Auth API ─────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body ?? {}
    const { rows } = await pool.query('SELECT data FROM users')
    const user = rows.map(r => r.data).find(u =>
      u.username.toLowerCase() === (username ?? '').toLowerCase() &&
      u.password === password &&
      u.status === 'active'
    )
    if (!user) return res.status(401).json({ error: 'Invalid username or password.' })
    await pool.query(
      'UPDATE users SET data = data || $1 WHERE id = $2',
      [JSON.stringify({ lastLogin: new Date().toISOString() }), user.id]
    )
    res.json({
      token: `mock-jwt-${Date.now()}`,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body ?? {}
    const { rows } = await pool.query('SELECT data FROM users')
    const user = rows.map(r => r.data).find(u =>
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
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Tasks API ────────────────────────────────────────────────────────────────
app.get('/api/tasks', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM tasks ORDER BY created_at DESC')
    res.json(rows.map(r => r.data))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM tasks WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' })
    res.json(rows[0].data)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const now = new Date().toISOString()
    const id = await generateTaskId()
    const task = {
      checklist: [],
      recurring: null,
      templateId: null,
      ...req.body,
      id,
      createdAt: now,
      updatedAt: now,
    }
    await pool.query('INSERT INTO tasks (id, data) VALUES ($1, $2)', [id, task])
    const authorName = req.body.createdBy ?? 'System'
    await logActivity(id, authorName, 'created this task', null, null, null)
    broadcastEvent('task_created', { id })
    res.status(201).json(task)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM tasks WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' })
    const old = rows[0].data
    const authorName = req.body.updatedBy ?? 'System'
    const updated = { ...old, ...req.body, updatedAt: new Date().toISOString() }
    await pool.query('UPDATE tasks SET data = $1 WHERE id = $2', [updated, req.params.id])

    // Log activity for key field changes
    const watched = ['status', 'priority', 'assignedTo', 'dueDate']
    for (const field of watched) {
      if (req.body[field] !== undefined && req.body[field] !== old[field]) {
        await logActivity(
          req.params.id, authorName,
          `changed ${field}`,
          field,
          String(old[field] ?? ''),
          String(req.body[field] ?? '')
        )
      }
    }
    broadcastEvent('task_updated', { id: req.params.id })
    res.json(updated)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
    broadcastEvent('task_deleted', { id: req.params.id })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Bulk update
app.post('/api/tasks/bulk', async (req, res) => {
  try {
    const { ids, update, updatedBy } = req.body ?? {}
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' })
    const now = new Date().toISOString()
    const results = []
    for (const id of ids) {
      const { rows } = await pool.query('SELECT data FROM tasks WHERE id = $1', [id])
      if (rows.length === 0) continue
      const old = rows[0].data
      const updated = { ...old, ...update, updatedAt: now }
      await pool.query('UPDATE tasks SET data = $1 WHERE id = $2', [updated, id])
      const watched = ['status', 'priority', 'assignedTo']
      for (const field of watched) {
        if (update[field] !== undefined && update[field] !== old[field]) {
          await logActivity(id, updatedBy ?? 'System', `changed ${field}`, field, String(old[field] ?? ''), String(update[field] ?? ''))
        }
      }
      results.push(updated)
    }
    broadcastEvent('tasks_bulk_updated', { ids })
    res.json({ updated: results.length, tasks: results })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Comments API ─────────────────────────────────────────────────────────────
app.get('/api/tasks/:id/comments', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT data FROM comments WHERE task_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    )
    res.json(rows.map(r => r.data))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/tasks/:id/comments', async (req, res) => {
  try {
    const { body, authorName, authorId } = req.body ?? {}
    if (!body?.trim()) return res.status(400).json({ error: 'Comment body required' })
    const comment = {
      id: generateId('CMT'),
      taskId: req.params.id,
      authorName: authorName ?? 'Unknown',
      authorId: authorId ?? '',
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    await pool.query(
      'INSERT INTO comments (id, task_id, data) VALUES ($1, $2, $3)',
      [comment.id, req.params.id, comment]
    )
    await logActivity(req.params.id, authorName ?? 'Unknown', 'added a comment', null, null, null)
    broadcastEvent('comment_added', { taskId: req.params.id, commentId: comment.id })
    res.status(201).json(comment)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/tasks/:taskId/comments/:commentId', async (req, res) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.commentId])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Activity API ─────────────────────────────────────────────────────────────
app.get('/api/tasks/:id/activity', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT data FROM activity WHERE task_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    )
    res.json(rows.map(r => r.data))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Templates API ────────────────────────────────────────────────────────────
app.get('/api/templates', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM templates ORDER BY id')
    res.json(rows.map(r => r.data))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Users API ────────────────────────────────────────────────────────────────
app.get('/api/users', async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT data FROM users ORDER BY (data->>'id')")
    res.json(rows.map(r => r.data))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.post('/api/users', async (req, res) => {
  try {
    const id = await generateUserId()
    const user = { ...req.body, id, createdAt: new Date().toISOString(), lastLogin: null }
    await pool.query('INSERT INTO users (id, data) VALUES ($1, $2)', [id, user])
    res.status(201).json(user)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.put('/api/users/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM users WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' })
    const updated = { ...rows[0].data, ...req.body }
    await pool.query('UPDATE users SET data = $1 WHERE id = $2', [updated, req.params.id])
    res.json(updated)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Config API ───────────────────────────────────────────────────────────────
app.get('/api/config', async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT data FROM config WHERE key = 'main'")
    res.json(rows[0]?.data ?? INITIAL_CONFIG)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.put('/api/config', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT data FROM config WHERE key = 'main'")
    const updated = { ...(rows[0]?.data ?? INITIAL_CONFIG), ...req.body }
    await pool.query(
      "INSERT INTO config (key, data) VALUES ('main', $1) ON CONFLICT (key) DO UPDATE SET data = $1",
      [updated]
    )
    res.json(updated)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── SLA Settings ────────────────────────────────────────────────────────────
const DEFAULT_SLA_DAYS = {
  presentation_design: 3,
  presentation_translation: 2,
  graphic_design: 5,
  content_writing: 4,
  event_management: 7,
}

app.get('/api/settings/sla', async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT data FROM config WHERE key = 'sla'")
    res.json(rows[0]?.data ?? DEFAULT_SLA_DAYS)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.put('/api/settings/sla', async (req, res) => {
  try {
    const incoming = req.body ?? {}
    // Merge with defaults so all keys are always present
    const updated = { ...DEFAULT_SLA_DAYS, ...incoming }
    await pool.query(
      "INSERT INTO config (key, data) VALUES ('sla', $1) ON CONFLICT (key) DO UPDATE SET data = $1",
      [updated]
    )
    res.json(updated)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

// ─── Start ────────────────────────────────────────────────────────────────────
initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1) })
