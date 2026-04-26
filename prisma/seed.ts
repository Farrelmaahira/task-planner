import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
  { name: 'Kuliah', color: '#6366f1', icon: '📚' },
  { name: 'Himpunan', color: '#10b981', icon: '🏛️' },
  { name: 'Kepanitiaan', color: '#f59e0b', icon: '🎯' },
  { name: 'Pribadi', color: '#ec4899', icon: '✨' },
  { name: 'Tugas', color: '#3b82f6', icon: '📝' },
]

async function main() {
  console.log('🌱 Seeding database...')
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
