import { Temporal } from 'temporal-polyfill'
import { db, mostRecentStatDate, oldestStatDate } from '../data/database'
import { getCachedUser } from '../data/users.ts'
import { jsDateToPlainDate } from '../helpers'
import { makeCalendar } from './calendar'
import { renderImage } from './image'
import { makeChart } from './chart'
import { makeStatsWidget } from './stats'

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

function getUserLabel(user: {
  display_name: string | null
  real_name: string | null
  user_id: string
}) {
  return user.display_name || user.real_name || user.user_id
}

function getUserInitials(user: {
  display_name: string | null
  real_name: string | null
  user_id: string
}) {
  return (
    getUserLabel(user)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

async function inlineImage(url?: string | null) {
  if (!url) return undefined

  try {
    const response = await fetch(url)
    if (!response.ok) return undefined

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream'
    const bytes = new Uint8Array(await response.arrayBuffer())
    const base64 = Buffer.from(bytes).toString('base64')

    return `data:${contentType};base64,${base64}`
  } catch {
    return undefined
  }
}

function alignedSundayOnOrBefore(date: Temporal.PlainDate) {
  let current = date
  while (current.dayOfWeek !== 7) {
    current = current.subtract({ days: 1 })
  }
  return current
}

export async function generateReport(userId: string, showAll = false) {
  console.time('data fetching')
  const [user, endDate] = await Promise.all([
    getCachedUser(userId),
    mostRecentStatDate(),
  ])
  const userWithDays = await db.user.findUnique({
    where: { user_id: user.user_id },
    include: { UserDay: true },
  })
  console.timeEnd('data fetching')

  console.time('data processing')
  if (!userWithDays) {
    throw new Error(`User with ID ${userId} not found`)
  }
  const activityByDate = new Map<string, dayInfo>()
  const userDays = userWithDays.UserDay.map((day) => ({
    ...day,
    date: jsDateToPlainDate(day.date),
  }))
  for (const day of userDays) {
    activityByDate.set(day.date.toString(), day)
  }

  const { streakLength, streakStartDate, streakLongerThanMax } =
    calculateStreak(activityByDate, endDate)
  const avatarSrc = await inlineImage(user.profile_picture)
  const statsElement = makeStatsWidget(userDays)

  let visibleStartDate = endDate.subtract({ years: 1 }).add({ days: 1 })
  if (showAll && userDays.length > 0) {
    visibleStartDate = userDays.reduce(
      (oldest, day) =>
        Temporal.PlainDate.compare(day.date, oldest) < 0 ? day.date : oldest,
      userDays[0]!.date
    )
  }
  const calendarStartDate = alignedSundayOnOrBefore(visibleStartDate)
  const { calendarElement, calendarWidth, calendarHeight } = await makeCalendar(
    activityByDate,
    calendarStartDate,
    endDate,
    showAll
  )

  const chartHeight = 150
  const chartElement = await makeChart(
    activityByDate,
    calendarStartDate,
    endDate,
    calendarWidth,
    chartHeight
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
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              width={60}
              height={60}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Roboto',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {getUserInitials(user)}
            </div>
          )}
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
              {getUserLabel(user)}
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
        <div
          style={{
            width: 320,
            height: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
          }}
        >
          {statsElement}
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
  const height = 10 + 60 + 10 + chartHeight + 10 + calendarHeight + 10 + 12 + 10

  console.timeEnd('data processing')

  return renderImage(element, width, height, {
    mode: 'zoom',
    value: 2,
  })
}

if (import.meta.main) {
  const [userId, mode] = Bun.argv.slice(2)
  if (!userId) {
    throw new Error('Usage: bun src/reports/report.tsx <user-id> [all]')
  }
  if (mode && mode !== 'all') {
    throw new Error('Optional second argument must be "all"')
  }
  const showAll = mode === 'all'
  try {
    console.time('calendar generation')
    const pngData = await generateReport(userId, showAll)
    await Bun.write('./tmp-calendar.png', pngData)
    console.timeEnd('calendar generation')
    console.log(
      `Calendar saved to tmp-calendar.png for user ${userId}${showAll ? ' (all)' : ''}`
    )
  } finally {
    await db.$disconnect()
  }
}
