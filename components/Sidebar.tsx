'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ListTodo, Tag, CheckCircle2 } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  _count: { tasks: number }
}

export function Sidebar({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tasks', label: 'Semua Kegiatan', icon: ListTodo },
  ]

  return (
    <aside
      className="flex flex-col w-64 shrink-0 h-full border-r"
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <CheckCircle2 size={16} />
        </div>
        <div>
          <h1 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
            Planner
          </h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Atur kegiatanmu</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: 'var(--muted)' }}>
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'
                if (!isActive) e.currentTarget.style.color = 'var(--foreground)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                if (!isActive) e.currentTarget.style.color = 'var(--muted)'
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}

        {/* Categories */}
        <div className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: 'var(--muted)' }}>
            <Tag size={10} className="inline mr-1" />
            Kategori
          </p>
          {categories.map((cat) => {
            const isActive = pathname === `/tasks?category=${cat.id}`
            return (
              <Link
                key={cat.id}
                href={`/tasks?category=${cat.id}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group"
                style={{
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--foreground)' : 'var(--muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'
                  e.currentTarget.style.color = 'var(--foreground)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive ? 'var(--bg-surface)' : 'transparent'
                  e.currentTarget.style.color = isActive ? 'var(--foreground)' : 'var(--muted)'
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.icon} {cat.name}</span>
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  {cat._count.tasks}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom: Theme Toggle */}
      <div
        className="px-4 py-3 border-t flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          Tema tampilan
        </span>
        <ThemeToggle />
      </div>
    </aside>
  )
}
