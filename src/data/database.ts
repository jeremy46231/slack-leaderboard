import { PrismaClient } from '@prisma/client'
import { jsDateToPlainDate } from '../helpers'

const prismaDB = new PrismaClient()

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
