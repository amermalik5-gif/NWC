const API = '/api'

export interface TaskTemplate {
  id: string
  name: string
  description: string
  defaults: {
    serviceTypes?: string[]
    priority?: string
    status?: string
    checklist?: { id: string; text: string; completed: boolean }[]
  }
}

export async function getTemplates(): Promise<TaskTemplate[]> {
  const res = await fetch(`${API}/templates`)
  if (!res.ok) throw new Error('Failed to load templates')
  return res.json()
}
