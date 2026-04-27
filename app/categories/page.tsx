import { getCategories } from '@/app/actions'
import { CategoryListClient } from '@/components/CategoryListClient'
import { Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kategori — Planner',
  description: 'Kelola kategori untuk mengelompokkan kegiatanmu.',
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Page heading */}
      <div className="flex items-center gap-2 mb-1 animate-fade-up">
        <Tag size={18} style={{ color: 'var(--accent)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Manajemen</p>
      </div>

      <CategoryListClient categories={categories} />
    </div>
  )
}
