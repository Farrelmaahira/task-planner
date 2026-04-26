import { getTasks, getCategories } from '@/app/actions'
import { TaskListClient } from '@/components/TaskListClient'
import { ListTodo } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categoryId = searchParams?.category
  const [tasks, categories] = await Promise.all([
    getTasks(categoryId),
    getCategories(),
  ])

  const activeCategory = categories.find((c) => c.id === categoryId)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          {activeCategory ? (
            <>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeCategory.color }}
              />
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                {activeCategory.icon} {activeCategory.name}
              </h1>
            </>
          ) : (
            <>
              <ListTodo size={20} style={{ color: 'var(--accent)' }} />
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                Semua Kegiatan
              </h1>
            </>
          )}
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {tasks.length} kegiatan ditemukan
        </p>
      </div>

      {/* Interactive Task List (Client Component handles Add button + Modal) */}
      <TaskListClient tasks={tasks as any} categories={categories as any} />
    </div>
  )
}
