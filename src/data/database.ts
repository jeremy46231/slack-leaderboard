import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../prisma/generated/client.ts'
import { jsDateToPlainDate } from '../helpers'

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL']!,
})
const prismaDB = new PrismaClient({ adapter })

await prismaDB.$connect()

export const db = prismaDB

export async function mostRecentStatDate() {
  const mostRecent = await db.day.findFirst({
    orderBy: { date: 'desc' },
    select: { date: true },
  })
  if (!mostRecent) {
    throw new Error('No stats in the database')
  }
  return jsDateToPlainDate(mostRecent.date)
}

const oldestStatRecord = await db.day.findFirst({
  orderBy: { date: 'asc' },
  select: { date: true },
})

if (!oldestStatRecord) {
  throw new Error('No stats in the database')
}

export const oldestStatDate = jsDateToPlainDate(oldestStatRecord.date)
