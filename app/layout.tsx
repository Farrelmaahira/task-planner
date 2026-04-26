import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Sidebar } from '@/components/Sidebar'
import { getCategories } from './actions'

export const metadata: Metadata = {
  title: 'Planner — Atur Kegiatanmu',
  description:
    'Aplikasi to-do list dan planner untuk mahasiswa aktif. Kelola tugas kuliah, kegiatan himpunan, kepanitiaan, dan kegiatan pribadi dalam satu tempat.',
  keywords: ['planner', 'to-do list', 'mahasiswa', 'himpunan', 'jadwal'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar categories={categories} />
            <main className="flex-1 overflow-y-auto bg-base">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
