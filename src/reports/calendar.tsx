import { Temporal } from 'temporal-polyfill'
import type { dayInfo } from './report'

const CELL_SIZE = 16
const CELL_PADDING = 3

function getActivityColor(
  day: {
    is_active: boolean
    messages_posted: number
  } = { is_active: false, messages_posted: 0 }
) {
  if (!day.is_active) return '#ebedf0' // Gray for no activity
  if (day.messages_posted < 10) return '#9be9a8'
  if (day.messages_posted < 100) return '#40c463'
  if (day.messages_posted < 500) return '#30a14e'
  return '#216e39' // Darkest green for 500+ messages
}

export async function makeCalendar(
  activityByDate: Map<string, dayInfo>,
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate
) {
  const weeks: Temporal.PlainDate[][] = []
  let currentDay = startDate
  while (currentDay.dayOfWeek !== 7) {
    currentDay = currentDay.subtract({ days: 1 })
  }

  while (Temporal.PlainDate.compare(currentDay, endDate) <= 0) {
    const week: Temporal.PlainDate[] = []
    for (let i = 0; i < 7; i++) {
      week.push(currentDay)
      currentDay = currentDay.add({ days: 1 })
    }
    weeks.push(week)
  }

  const calendarElement = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingRight: 5,
        fontSize: 10,
        fontFamily: 'Roboto',
      }}
    >
      <div
        style={{
          width: 26,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ height: CELL_SIZE }}></div>
        <div style={{ height: CELL_SIZE }}></div>
        <div
          style={{
            height: CELL_SIZE,
            transform: 'translateY(3px)',
          }}
        >
          Mon
        </div>
        <div style={{ height: CELL_SIZE }}></div>
        <div
          style={{
            height: CELL_SIZE,
            transform: 'translateY(3px)',
          }}
        >
          Wed
        </div>
        <div style={{ height: CELL_SIZE }}></div>
        <div
          style={{
            height: CELL_SIZE,
            transform: 'translateY(3px)',
          }}
        >
          Fri
        </div>
        <div style={{ height: CELL_SIZE }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {weeks.map((week, i) => {
          // const firstDayOfYear = week.find(
          //   (day) => day.day === 1 && day.month === 1
          // )
          const firstDayOfMonth = week.find((day) => day.day === 1)

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: CELL_SIZE,
              }}
            >
              <div key={i} style={{ width: CELL_SIZE, height: CELL_SIZE }}>
                {
                  /*firstDayOfYear
                    ? firstDayOfYear.toLocaleString('en-US', { year: 'numeric' })
                    :*/ firstDayOfMonth
                    ? firstDayOfMonth.toLocaleString('en-US', {
                        month: 'short',
                      })
                    : null
                }
              </div>
              {week.map((day, j) => {
                const withinRange =
                  Temporal.PlainDate.compare(day, startDate) >= 0 &&
                  Temporal.PlainDate.compare(day, endDate) <= 0
                const activity = activityByDate.get(day.toString())

                return (
                  <div
                    key={j}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {withinRange && (
                      <div
                        title={`${day.toString()}: ${
                          activity?.is_active
                            ? `${activity?.messages_posted} messages`
                            : 'No activity'
                        }`}
                        style={{
                          width: CELL_SIZE - CELL_PADDING,
                          height: CELL_SIZE - CELL_PADDING,
                          backgroundColor: getActivityColor(activity),
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )

  // one cell per week + 26px for day labels + 5px padding
  const calendarWidth = weeks.length * CELL_SIZE + 26 + 5
  // 7 days + 1 for month labels
  const calendarHeight = (7 + 1) * CELL_SIZE

  return {
    calendarElement,
    calendarWidth,
    calendarHeight,
  }
}
