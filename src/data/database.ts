import { type Prisma, PrismaClient } from '@prisma/client'
import type { userDay } from './getStats'
import { Temporal } from 'temporal-polyfill'

const prismaDB = new PrismaClient()

await prismaDB.$connect()

export const db = prismaDB
