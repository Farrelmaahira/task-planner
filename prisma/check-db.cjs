const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  // Check what tables exist
  const tables = await prisma.$queryRaw`
    SELECT table_name, table_schema 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `
  console.log('Tables in public schema:')
  console.log(JSON.stringify(tables, null, 2))

  // Check enums
  const enums = await prisma.$queryRaw`
    SELECT typname FROM pg_type WHERE typtype = 'e';
  `
  console.log('\nEnums:')
  console.log(JSON.stringify(enums, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
