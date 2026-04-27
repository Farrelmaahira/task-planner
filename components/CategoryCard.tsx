'use client'

import { useState, useTransition } from 'react'
import { deleteCategory } from '@/app/actions'
import { CategoryForm } from './CategoryForm'
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  _count: { tasks: number }
}

export function CategoryCard({ category }: { category: Category }) {
  const [showEdit, setShowEdit] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteCategory(category.id)
      setShowConfirm(false)
    })
  }

  return (
    <>
      <div
        className="group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-150 animate-fade-up"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          borderLeft: `4px solid ${category.color}`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface)' }}
      >
        {/* Left: icon + name + task count */}
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: category.color + '20', border: `2px solid ${category.color}40` }}
          >
            {category.icon || '🏷️'}
          </span>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              {category.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={11} style={{ color: 'var(--muted)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {category._count.tasks} kegiatan
              </span>
            </div>
          </div>
        </div>

        {/* Right: color dot + actions */}
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              id={`edit-category-${category.id}`}
              onClick={() => setShowEdit(true)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
              title="Edit kategori"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-soft)'
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--muted)'
              }}
            >
              <Pencil size={14} />
            </button>
            <button
              id={`delete-category-${category.id}`}
              onClick={() => setShowConfirm(true)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
              title="Hapus kategori"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2'
                e.currentTarget.style.color = 'var(--danger)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--muted)'
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <CategoryForm
          category={category}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Delete Confirm Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-scale-in"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.icon || '🏷️'}
              </span>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  Hapus &ldquo;{category.name}&rdquo;?
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Tindakan ini tidak bisa dibatalkan.
                </p>
              </div>
            </div>

            {category._count.tasks > 0 && (
              <div
                className="text-xs px-3 py-2 rounded-lg mb-4"
                style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}
              >
                ⚠️ Kategori ini masih memiliki <strong>{category._count.tasks} kegiatan</strong>. Semua kegiatan akan ikut terhapus.
              </div>
            )}

            <div className="flex gap-2">
              <button
                id={`cancel-delete-${category.id}`}
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
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
                id={`confirm-delete-${category.id}`}
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-70"
                style={{ backgroundColor: '#ef4444' }}
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
