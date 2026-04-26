import { getDashboardStats, getUpcomingTasks, getCategories } from './actions'
import { StatCard } from '@/components/StatCard'
import { TaskListClient } from '@/components/TaskListClient'
import { Clock, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default async function DashboardPage() {
  const [stats, upcomingTasks, categories] = await Promise.all([
    getDashboardStats(),
    getUpcomingTasks(),
    getCategories(),
  ])

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>{today}</p>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          {getGreeting()} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {stats.pending > 0
            ? `Kamu masih punya ${stats.pending} kegiatan yang belum diselesaikan.`
            : '🎉 Semua kegiatan sudah selesai! Kerja bagus!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Kegiatan" value={stats.total} icon="📋" accentColor="#6366f1" />
        <StatCard label="Selesai" value={stats.completed} icon="✅" accentColor="#10b981" />
        <StatCard label="Akan Datang" value={stats.upcoming} icon="⏳" accentColor="#f59e0b" />
        <StatCard label="Terlambat" value={stats.overdue} icon="🚨" accentColor="#ef4444" />
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} style={{ color: 'var(--accent)' }} />
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Tenggat Waktu Dekat
            </h2>
          </div>
          <div className="space-y-2.5">
            {upcomingTasks.map((task) => {
              const due = new Date(task.dueDate!)
              const diffDays = Math.ceil((due.getTime() - Date.now()) / 86400000)
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border animate-slide-in"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderLeft: `3px solid ${task.category.color}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{task.category.icon}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {task.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {task.category.name}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: diffDays <= 1 ? '#fef2f2' : 'var(--accent-soft)',
                      color: diffDays <= 1 ? '#ef4444' : 'var(--accent)',
                    }}
                  >
                    {diffDays === 0 ? 'Hari ini' : diffDays === 1 ? 'Besok' : `${diffDays} hari`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Add + Empty State */}
      {stats.total === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed text-center animate-fade-up"
          style={{ borderColor: 'var(--border)' }}
        >
          <Sparkles size={40} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
          <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
            Mulai tambahkan kegiatanmu!
          </p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--muted)' }}>
            Klik tombol "Tambah Kegiatan" untuk mencatat tugas, jadwal, atau kegiatanmu.
          </p>
        </div>
      )}
    </div>
  )
}
