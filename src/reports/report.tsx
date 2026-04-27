import { Temporal } from 'temporal-polyfill'
import { db, mostRecentStatDate, oldestStatDate } from '../data/database'
import { jsDateToPlainDate } from '../helpers'
import { makeCalendar } from './calendar'
import { renderImage } from './image'
import { makeChart } from './chart'

export type dayInfo = {
  date: Temporal.PlainDate
  user_id: string
  is_active: boolean
  is_desktop: boolean
  is_ios: boolean
  is_android: boolean
  messages_posted: number
  messages_posted_in_channel: number
  reactions_added: number
}

function calculateStreak(
  activityByDate: Map<string, dayInfo>,
  endDate: Temporal.PlainDate
) {
  let streakLength = 0
  let currentDate = endDate

  while (true) {
    const dayInfo = activityByDate.get(currentDate.toString())
    if (dayInfo && dayInfo.is_active) {
      streakLength++
      currentDate = currentDate.subtract({ days: 1 })
    } else {
      break
    }
  }

  const streakStartDate = endDate.subtract({ days: streakLength - 1 })
  const streakLongerThanMax =
    Temporal.PlainDate.compare(streakStartDate, oldestStatDate) <= 0

  return {
    streakLength,
    streakStartDate,
    streakLongerThanMax,
  }
}

async function generateReport(userId: string) {
  console.time('data fetching')
  const user = await db.user.findUnique({
    where: { user_id: userId },
    include: { UserDay: true },
  })
  const endDate = await mostRecentStatDate()
  console.timeEnd('data fetching')

  console.time('data processing')
  if (!user) {
    throw new Error(`User with ID ${userId} not found`)
  }
  const userDays =
    user.UserDay.map((day) => ({
      ...day,
      date: jsDateToPlainDate(day.date),
    })) || []
  const activityByDate = new Map<string, dayInfo>()
  for (const day of userDays) {
    activityByDate.set(day.date.toString(), day)
  }

  const { streakLength, streakStartDate, streakLongerThanMax } =
    calculateStreak(activityByDate, endDate)

  // let startDate = endDate.with({ month: 1, day: 1 })
  let calendarStartDate = endDate.subtract({ years: 1 }).add({ days: 1 })
  while (calendarStartDate.dayOfWeek !== 7) {
    // go back to the most recent Sunday
    calendarStartDate = calendarStartDate.subtract({ days: 1 })
  }
  const { calendarElement, calendarWidth, calendarHeight } = await makeCalendar(
    activityByDate,
    calendarStartDate,
    endDate
  )

  const chartElement = await makeChart(
    activityByDate,
    calendarStartDate,
    endDate,
    800,
    150
  )

  const element = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 10,
        gap: 10,
      }}
    >
      <div
        style={{
          height: 60,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <img
          src={user.profile_picture ?? undefined}
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: 12,
            fontFamily: 'Roboto',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>
            {user.display_name || user.real_name}
          </span>
          <span style={{ fontSize: 14, color: '#555' }}>
            Current streak: {streakLongerThanMax ? 'at least ' : ''}
            {streakLength} days (
            {streakLongerThanMax ? 'no data before ' : 'since '}
            {streakStartDate.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            )
          </span>
        </div>
      </div>
      {chartElement}
      {calendarElement}
      <div
        style={{
          height: 12,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          fontSize: 10,
          color: '#333',
          fontFamily: 'Roboto',
        }}
      >
        Data updated{' '}
        {endDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}{' '}
        &bull; Made by
        <span
          style={{
            height: 11,
            marginLeft: 1,
            paddingLeft: 1.5,
            paddingRight: 1,
            backgroundColor: '#1d9bd11a',
            color: '#1264a3',
            borderRadius: 3,
          }}
        >
          @Jeremy
        </span>
        &nbsp;&bull; Get yours in
        <span
          style={{
            height: 11,
            paddingLeft: 1.5,
            paddingRight: 1,
            backgroundColor: '#1d9bd11a',
            color: '#1264a3',
            borderRadius: 3,
          }}
        >
          #slack-stats
        </span>
        !
      </div>
    </div>
  )
  // padding + calendar + padding
  const width = 10 + calendarWidth + 10
  // padding + profile pic + padding + calendar + padding + footer + padding
  const height = 10 + 60 + 10 + 150 + 10 + calendarHeight + 10 + 12 + 10

  console.timeEnd('data processing')

  return renderImage(element, width, height, {
    mode: 'zoom',
    value: 2,
  })
}

if (import.meta.main) {
  const userId = 'U059VC0UDEU'
  console.time('calendar generation')
  const pngData = await generateReport(userId)
  await Bun.write('./tmp-calendar.png', pngData)
  console.timeEnd('calendar generation')
  console.log(`Calendar saved to tmp-calendar.png for user ${userId}`)
}
