import { db, mostRecentStatDate } from '../src/data/database.ts'
import { plainDateToString, runThreaded } from '../src/helpers.ts'
import { getUserProfile } from '../src/slackAPI/botAPI.ts'

// Get all users with more than 10 user days
const users = await db.user.findMany({
  select: { user_id: true },
  where: {
    UserDay: {
      some: {
        date: {
          gte: plainDateToString(
            (await mostRecentStatDate()).subtract({ days: 14 })
          ),
        },
      },
    },
  },
})

console.log(`Fetching ${users.length} users...`)

await runThreaded(users, users.length, 5, async (user) => {
  const profile = await getUserProfile(user.user_id)
  await db.user.upsert({
    where: { user_id: user.user_id },
    create: profile,
    update: profile,
  })
})

console.log(`Fetched ${users.length} users`)
process.exit(0)
