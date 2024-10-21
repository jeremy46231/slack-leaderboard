import { type Prisma, PrismaClient } from '@prisma/client'

const prismaDB = new PrismaClient()

await prismaDB.$connect()

export const db = prismaDB
