import { Temporal } from 'temporal-polyfill'
import { getAvailableDates, getRangeStats } from '../slack/userAPI.ts'
import { db } from './database.ts'
import { runThreaded } from '../helpers.ts'
import { getUserProfile } from '../slack/botAPI.ts'

export type userDay = {
  user_id: string
  date: Temporal.PlainDate
  is_active: boolean
  is_desktop: boolean
  is_ios: boolean
  is_android: boolean
  messages_posted: number
  messages_posted_in_channel: number
  reactions_added: number
}

export async function getDayStats(day: Temporal.PlainDate): Promise<userDay[]> {
  const data = await getRangeStats(day, day)
  const converted = data.map((member) => ({
    user_id: member.user_id,
    date: day,
    is_active: member.days_active > 0,
    is_desktop: member.days_active_desktop > 0,
    is_ios: member.days_active_ios > 0,
    is_android: member.days_active_android > 0,
    messages_posted: member.messages_posted,
    messages_posted_in_channel: member.messages_posted_in_channel,
    reactions_added: member.reactions_added,
  }))
  return converted
}

function* daysGenerator(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate
) {
  if (Temporal.PlainDate.compare(startDate, endDate) > 0) {
    throw new Error('Start date is after end date')
  }
  for (
    let date = startDate;
    Temporal.PlainDate.compare(date, endDate) <= 0;
    date = date.add({ days: 1 })
  ) {
    yield date
  }
}

export async function getStats(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  threadCount = 5
) {
  const stats: userDay[] = []
  const userIDs = new Set<string>()

  const days = daysGenerator(startDate, endDate)
  const totalDays = startDate.until(endDate).total({ unit: 'days' }) + 1

  await runThreaded(
    days,
    totalDays,
    threadCount,
    async (day) => {
      const dayStats = await getDayStats(day)

      stats.push(...dayStats)
      dayStats.forEach((day) => userIDs.add(day.user_id))
    }
  )


  const newUserIDsResult = await db.$queryRaw<Array<{ user_id: string }>>`
    WITH provided_ids AS (
      SELECT unnest(array[${[...userIDs.values()]}]) AS user_id
    )
    SELECT user_id 
    FROM provided_ids
    WHERE user_id NOT IN (SELECT user_id FROM "User")`

  const newUserIDs = newUserIDsResult.map((user) => ({ user_id: user.user_id }))

  if (newUserIDs.length > 0) {
    console.log(`Found ${newUserIDs.length} new users, fetching profiles...`)

    await runThreaded(
      newUserIDs.values(),
      newUserIDs.length,
      threadCount,
      async (user) => {
        const profile = await getUserProfile(user.user_id)
        await db.user.create({
          data: profile,
        })
      }
    )

    console.log('Finished fetching profiles')
  }

  console.log('Adding stats to database...')

  await db.userDay.createMany({
    data: stats.map((stat) => ({
      ...stat,
      date: stat.date.toZonedDateTime('UTC').toInstant().toString(),
    })),
  })

  console.log('Finished adding stats to database')
}

const availibleDates = await getAvailableDates()
const end = availibleDates.end_date
const start = end.subtract({ days: 29 })
console.log(`Fetching stats from ${start} to ${end}`)
const stats = await getStats(start, end)

