'use client'

import { useState } from 'react'
import { Check, Pencil, Trash2, Clock, AlertCircle, ChevronDown } from 'lucide-react'
import { toggleTaskComplete, deleteTask } from '@/app/actions'
import { Task, Priority } from '@/types'

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  HIGH: { label: 'Penting', color: '#ef4444' },
  MEDIUM: { label: 'Sedang', color: '#f59e0b' },
  LOW: { label: 'Rendah', color: '#10b981' },
}

function formatDueDate(dueDate: Date | null): { text: string; isOverdue: boolean } {
  if (!dueDate) return { text: '', isOverdue: false }
  const now = new Date()
  const due = new Date(dueDate)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: `${Math.abs(diffDays)} hari lalu`, isOverdue: true }
  if (diffDays === 0) return { text: 'Hari ini', isOverdue: false }
  if (diffDays === 1) return { text: 'Besok', isOverdue: false }
  return {
    text: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    isOverdue: false,
  }
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [loading, setLoading] = useState(false)
  const { text: dueDateText, isOverdue } = formatDueDate(task.dueDate)
  const priority = priorityConfig[task.priority]

  const handleToggle = async () => {
    setLoading(true)
    await toggleTaskComplete(task.id, !task.isCompleted)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus kegiatan "${task.title}"?`)) return
    await deleteTask(task.id)
  }

  return (
    <div
      className="group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 animate-fade-up"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        opacity: task.isCompleted ? 0.65 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent-soft)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          borderColor: task.isCompleted ? task.category.color : 'var(--border)',
          backgroundColor: task.isCompleted ? task.category.color : 'transparent',
        }}
      >
        {task.isCompleted && <Check size={11} color="white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-semibold leading-snug"
            style={{
              color: 'var(--foreground)',
              textDecoration: task.isCompleted ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </h3>
          {/* Actions (visible on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--muted)'
              }}
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDelete}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff1f2'
                e.currentTarget.style.color = '#ef4444'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--muted)'
              }}
              title="Hapus"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted)' }}>
            {task.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-2 mt-2.5">
          {/* Category badge */}
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: task.category.color + '20',
              color: task.category.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: task.category.color }}
            />
            {task.category.icon} {task.category.name}
          </span>

          {/* Priority */}
          <span
            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: priority.color + '15',
              color: priority.color,
            }}
          >
            <AlertCircle size={10} />
            {priority.label}
          </span>

          {/* Due date */}
          {dueDateText && (
            <span
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: isOverdue ? '#ef4444' : 'var(--muted)' }}
            >
              <Clock size={11} />
              {dueDateText}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
