'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { Task, Category } from '@/types'

interface TaskListClientProps {
  tasks: Task[]
  categories: Category[]
}

export function TaskListClient({ tasks, categories }: TaskListClientProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const handleEdit = (task: Task) => {
    setEditTask(task)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditTask(null)
  }

  const pending = tasks.filter((t) => !t.isCompleted)
  const completed = tasks.filter((t) => t.isCompleted)

  return (
    <>
      {/* Add Button */}
      <button
        onClick={() => setFormOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm shrink-0"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        <Plus size={16} />
        Tambah Kegiatan
      </button>

      {/* Task Lists */}
      <div className="space-y-6 mt-6">
        {/* Pending */}
        {pending.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
              Belum Selesai ({pending.length})
            </p>
            <div className="space-y-2.5">
              {pending.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
              Selesai ({completed.length})
            </p>
            <div className="space-y-2.5">
              {completed.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Tidak ada kegiatan di sini
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Tambah kegiatan baru dengan menekan tombol di atas.
            </p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <TaskForm
        open={formOpen}
        onClose={handleClose}
        categories={categories}
        editTask={editTask}
      />
    </>
  )
}
