'use client'

import { useState, useEffect, useRef } from 'react'
import { X, CalendarDays, Tag, AlertCircle, Loader2 } from 'lucide-react'
import { createTask, updateTask } from '@/app/actions'
import { Task, Category, TaskFormData, Priority } from '@/types'

interface TaskFormProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  editTask?: Task | null
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'HIGH', label: '🔴 Penting', color: '#ef4444' },
  { value: 'MEDIUM', label: '🟡 Sedang', color: '#f59e0b' },
  { value: 'LOW', label: '🟢 Rendah', color: '#10b981' },
]

export function TaskForm({ open, onClose, categories, editTask }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    categoryId: categories[0]?.id ?? '',
  })

  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        description: editTask.description ?? '',
        dueDate: editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().slice(0, 16)
          : '',
        priority: editTask.priority,
        categoryId: editTask.categoryId,
      })
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        categoryId: categories[0]?.id ?? '',
      })
    }
    if (open) setTimeout(() => titleRef.current?.focus(), 100)
  }, [editTask, open, categories])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      if (editTask) {
        await updateTask(editTask.id, form)
      } else {
        await createTask(form)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-base)',
    color: 'var(--foreground)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl animate-scale-in"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
            {editTask ? 'Edit Kegiatan' : '➕ Tambah Kegiatan Baru'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
              Nama Kegiatan *
            </label>
            <input
              ref={titleRef}
              type="text"
              required
              placeholder="Contoh: Mengerjakan tugas Struktur Data"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
              Deskripsi (opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Detail atau catatan tambahan..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
                <Tag size={11} /> Kategori
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
                <AlertCircle size={11} /> Prioritas
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
              <CalendarDays size={11} /> Tenggat Waktu (opsional)
            </label>
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--bg-surface-hover)',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {editTask ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
