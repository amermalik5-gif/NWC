import { useState } from 'react'
import { CheckSquare, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ChecklistItem } from '@/types/task'

interface TaskChecklistViewProps {
  items: ChecklistItem[]
  onToggle?: (id: string, completed: boolean) => void
  readOnly?: boolean
}

export function TaskChecklistView({ items, onToggle, readOnly }: TaskChecklistViewProps) {
  if (!items || items.length === 0) return null

  const done = items.filter((i) => i.completed).length
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Checklist
          </div>
          <span className="text-xs text-slate-500">
            {done}/{items.length} · {pct}%
          </span>
        </CardTitle>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-slate-100 mt-1">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-nwc-blue' : 'bg-amber-400'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.map((item) => (
          <label
            key={item.id}
            className={cn(
              'flex items-center gap-3 cursor-pointer rounded-md px-2 py-1.5 hover:bg-slate-50 transition-colors group',
              readOnly && 'cursor-default'
            )}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => !readOnly && onToggle?.(item.id, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-nwc-blue accent-nwc-blue"
              disabled={readOnly}
            />
            <span className={cn('text-sm flex-1', item.completed && 'line-through text-slate-400')}>
              {item.text}
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  )
}

/** Used inside TaskForm — edit mode */
interface TaskChecklistEditorProps {
  items: ChecklistItem[]
  onChange: (items: ChecklistItem[]) => void
}

export function TaskChecklistEditor({ items, onChange }: TaskChecklistEditorProps) {
  const [newText, setNewText] = useState('')

  const addItem = () => {
    if (!newText.trim()) return
    onChange([
      ...items,
      { id: `cl-${Date.now()}`, text: newText.trim(), completed: false },
    ])
    setNewText('')
  }

  const removeItem = (id: string) => {
    onChange(items.filter((i) => i.id !== id))
  }

  const updateText = (id: string, text: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, text } : i)))
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="text-xs text-slate-400 w-5 text-right">{idx + 1}.</span>
          <Input
            value={item.text}
            onChange={(e) => updateText(item.id, e.target.value)}
            className="flex-1 h-8 text-sm"
          />
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          placeholder="Add checklist item..."
          className="flex-1 h-8 text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8">
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
    </div>
  )
}
