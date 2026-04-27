'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { createCategory, updateCategory, CategoryFormData } from '@/app/actions'
import { X, Loader2, Palette, Smile } from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
}

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#84cc16', '#f97316', '#e11d48', '#7c3aed',
]

const PRESET_ICONS = ['📚', '💼', '🏠', '🏋️', '🎨', '🎵', '💡', '🚀', '❤️', '🌿', '⚡', '🎯', '📝', '🔧', '🌟', '🍀']

export function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(category?.name ?? '')
  const [color, setColor] = useState(category?.color ?? '#6366f1')
  const [icon, setIcon] = useState(category?.icon ?? '')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const isEdit = !!category

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Nama kategori tidak boleh kosong.')
      return
    }
    setError('')

    const data: CategoryFormData = {
      name: name.trim(),
      color,
      icon: icon || undefined,
    }

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateCategory(category.id, data)
        } else {
          await createCategory(data)
        }
        onClose()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan.'
        setError(message.includes('Unique constraint') ? 'Nama kategori sudah digunakan.' : message)
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl animate-scale-in"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon || '🏷️'}</span>
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
          </div>
          <button
            id="category-form-close"
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'
              e.currentTarget.style.color = 'var(--foreground)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Preview */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ backgroundColor: color + '25', border: `2px solid ${color}` }}
            >
              {icon || '🏷️'}
            </span>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {name || 'Nama Kategori'}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Preview kategori</p>
            </div>
            <div
              className="ml-auto w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>
              Nama Kategori
            </label>
            <input
              ref={inputRef}
              id="category-name-input"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="Contoh: Tugas Kuliah, Kepanitiaan..."
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-base)',
                border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                color: 'var(--foreground)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)' }}
            />
            {error && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>

          {/* Color */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              <Palette size={14} /> Warna
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  id={`color-${c.replace('#', '')}`}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                    boxShadow: color === c ? `0 0 0 1px var(--bg-surface)` : 'none',
                  }}
                />
              ))}
              {/* Custom color input */}
              <label
                className="w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                title="Pilih warna kustom"
              >
                <span className="text-xs">+</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              <Smile size={14} /> Ikon (Opsional)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_ICONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(icon === em ? '' : em)}
                  className="w-8 h-8 rounded-lg text-base transition-all hover:scale-110"
                  style={{
                    backgroundColor: icon === em ? 'var(--accent-soft)' : 'var(--bg-base)',
                    border: `1px solid ${icon === em ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
            <input
              id="category-icon-input"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Atau ketik emoji kustom..."
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              id="category-form-cancel"
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--bg-base)',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-base)' }}
            >
              Batal
            </button>
            <button
              id="category-form-submit"
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: isPending ? 'var(--muted)' : color }}
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
              {isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
