interface StatCardProps {
  label: string
  value: number
  icon: string
  accentColor: string
}

export function StatCard({ label, value, icon, accentColor }: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ backgroundColor: accentColor + '20' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          {value}
        </p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          {label}
        </p>
      </div>
    </div>
  )
}
