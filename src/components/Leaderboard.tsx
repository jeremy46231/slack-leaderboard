import { useEffect, useState } from 'react'
import { Temporal } from 'temporal-polyfill'
import { db, mostRecentStatDate } from '../data/database.ts'
import { plainDateToString } from '../helpers.ts'

export function Leaderboard({ userID }: { userID: string }) {
  const [startDate, setStartDate] = useState<Temporal.PlainDate | null>(null)
  const [endDate, setEndDate] = useState<Temporal.PlainDate | null>(null)
  const [leaderboard, setLeaderboard] =
    useState<Awaited<ReturnType<typeof getLeaderboard> | null>>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const fetchDates = async () => {
      const mostRecent = await mostRecentStatDate()
      if (abortController.signal.aborted) {
        return
      }
      setStartDate(mostRecent.subtract({ days: 7 }))
      setEndDate(mostRecent)
    }
    fetchDates()
    return () => {
      abortController.abort()
    }
  }, [])
  useEffect(() => {
    setLeaderboard(null)
    if (startDate === null || endDate === null) {
      return
    }
    const abortController = new AbortController()
    const fetchLeaderboard = async () => {
      const result = await getLeaderboard(startDate, endDate, userID)
      if (abortController.signal.aborted) {
        return
      }
      setLeaderboard(result)
    }
    fetchLeaderboard()
    return () => {
      abortController.abort()
    }
  }, [startDate, endDate, userID])

  return (
    <>
      <rich>
        <b>Top Users</b>
      </rich>
      <rich>
        From <code>{startDate?.toLocaleString() ?? '...'}</code> to{' '}
        <code>{endDate?.toLocaleString() ?? '...'}</code>
      </rich>
      <actions>
        <datepicker
          placeholder="Start date"
          onEvent={(event) => {
            const date = event.actions[0].selected_date
            if (!date) {
              setStartDate(null)
              return
            }
            setStartDate(Temporal.PlainDate.from(date))
          }}
        />
        <datepicker
          placeholder="End date"
          onEvent={(event) => {
            const date = event.actions[0].selected_date
            if (!date) {
              setEndDate(null)
              return
            }
            setEndDate(Temporal.PlainDate.from(date))
          }}
        />
      </actions>
      {leaderboard === null ? (
        <rich>Loading...</rich>
      ) : (
        <>
          <ol>
            {leaderboard.top.map(({ userID, messages }) => (
              <li key={userID}>
                <user>{userID}</user>: {messages} messages
              </li>
            ))}
          </ol>
          {leaderboard.userRow && (
            <>
              <rich>
                {leaderboard.userRow.place}.{' '}
                <user>{leaderboard.userRow.userID}</user>:{' '}
                {leaderboard.userRow.messages} messages
              </rich>
            </>
          )}
        </>
      )}
    </>
  )
}

async function getLeaderboard(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  userID: string,
  topCount = 10
): Promise<{
  top: {
    userID: string
    messages: number | null
  }[]
  userRow?: {
    place: number
    userID: string
    messages: number | null
  }
}> {
  const topActivity = await db.userDay.groupBy({
    by: ['user_id'],
    where: {
      date: {
        gte: plainDateToString(startDate),
        lte: plainDateToString(endDate),
      },
    },
    _sum: {
      messages_posted: true,
    },
    orderBy: {
      _sum: {
        messages_posted: 'desc',
      },
    },
    take: topCount,
  })

  const userInTop =
    topActivity.find((activity) => activity.user_id === userID) !== undefined

  let userRow:
    | {
        place: number
        userID: string
        messages: number | null
      }
    | undefined = undefined

  if (!userInTop) {
    const userActivity = await db.userDay.groupBy({
      by: ['user_id'],
      where: {
        user_id: userID,
        date: {
          gte: plainDateToString(startDate),
          lte: plainDateToString(endDate),
        },
      },
      _sum: {
        messages_posted: true,
      },
    })

    const userPlace =
      (
        await db.userDay.groupBy({
          by: ['user_id'],
          where: {
            date: {
              gte: plainDateToString(startDate),
              lte: plainDateToString(endDate),
            },
          },
          having: {
            messages_posted: {
              _sum: {
                gte: (await userActivity)[0]._sum.messages_posted ?? 0,
              },
            },
          },
        })
      ).length + 1

    userRow = {
      place: userPlace,
      userID,
      messages: userActivity[0]._sum.messages_posted ?? 0,
    }
  }

  return {
    top: topActivity.map((activity) => ({
      userID: activity.user_id,
      messages: activity._sum.messages_posted,
    })),
    userRow,
  }
}
