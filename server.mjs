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

// ─── Create tables and seed if empty ──────────────────────────────────────────
async function initDB() {
  const client = await pool.connect()
  try {
    // Create tables
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
    `)

    // Seed users if empty
    const { rowCount: userCount } = await client.query('SELECT 1 FROM users LIMIT 1')
    if (userCount === 0) {
      for (const user of INITIAL_USERS) {
        const now = new Date().toISOString()
        await client.query(
          'INSERT INTO users (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
          [user.id, { ...user, createdAt: now, lastLogin: null }]
        )
      }
      console.log('✅ Users seeded')
    }

    // Seed config if empty
    const { rowCount: configCount } = await client.query("SELECT 1 FROM config WHERE key='main' LIMIT 1")
    if (configCount === 0) {
      await client.query(
        "INSERT INTO config (key, data) VALUES ('main', $1) ON CONFLICT (key) DO NOTHING",
        [INITIAL_CONFIG]
      )
      console.log('✅ Config seeded')
    }

    console.log('✅ Database ready')
  } finally {
    client.release()
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
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
    // Update lastLogin
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
    const task = { ...req.body, id, createdAt: now, updatedAt: now }
    await pool.query('INSERT INTO tasks (id, data) VALUES ($1, $2)', [id, task])
    res.status(201).json(task)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM tasks WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' })
    const updated = { ...rows[0].data, ...req.body, updatedAt: new Date().toISOString() }
    await pool.query('UPDATE tasks SET data = $1 WHERE id = $2', [updated, req.params.id])
    res.json(updated)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ─── Users API ────────────────────────────────────────────────────────────────
app.get('/api/users', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT data FROM users ORDER BY (data->>\'id\')')
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

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

// ─── Start ────────────────────────────────────────────────────────────────────
initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1) })
