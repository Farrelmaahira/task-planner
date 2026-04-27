'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CategoryForm } from '@/components/CategoryForm'
import { CategoryCard } from '@/components/CategoryCard'

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  _count: { tasks: number }
}

export function CategoryListClient({ categories }: { categories: Category[] }) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Kategori
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {categories.length} kategori tersedia
          </p>
        </div>
        <button
          id="add-category-btn"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <Plus size={15} />
          Tambah Kategori
        </button>
      </div>

      {/* List */}
      {categories.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed text-center animate-fade-up"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-5xl mb-3">🏷️</span>
          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
            Belum ada kategori
          </p>
          <p className="text-xs mt-1 mb-4 max-w-xs" style={{ color: 'var(--muted)' }}>
            Buat kategori untuk mengelompokkan kegiatanmu, seperti Kuliah, Kepanitiaan, atau Pribadi.
          </p>
          <button
            id="empty-add-category-btn"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Plus size={14} />
            Buat Kategori Pertama
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && <CategoryForm onClose={() => setShowCreate(false)} />}
    </>
  )
}
