import { Temporal } from 'temporal-polyfill'
import {
  type middlewareArguments,
  type AnyBlock,
  plainDateToString,
} from './helpers.ts'
import { db, mostRecentStatDate } from './data/database.ts'

/** will be JSON, dates as strings */
type state = {
  startDate: string
  endDate: string
}

async function generateLeaderboard(state: state, userID: string) {
  const startDate = Temporal.PlainDate.from(state.startDate)
  const endDate = Temporal.PlainDate.from(state.endDate)

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
    take: 10,
  })

  const blocks: AnyBlock[] = []

  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: `Top activity from ${startDate.toLocaleString('en-US', {
        dateStyle: 'long',
      })} to ${endDate.toLocaleString('en-US', {
        dateStyle: 'long',
      })}`,
    },
  })

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'datepicker',
        action_id: 'date_picker_start',
        placeholder: {
          type: 'plain_text',
          text: 'Start date',
        },
        initial_date: state.startDate,
      },
      {
        type: 'datepicker',
        action_id: 'date_picker_end',
        placeholder: {
          type: 'plain_text',
          text: 'End date',
        },
        initial_date: state.endDate,
      },
    ],
  })

  blocks.push({
    type: 'rich_text',
    elements: [
      {
        type: 'rich_text_list',
        style: 'ordered',
        elements: topActivity.map((activity, i) => ({
          type: 'rich_text_section',
          elements: [
            {
              type: 'user',
              user_id: activity.user_id,
            },
            {
              type: 'text',
              text: `: ${activity._sum.messages_posted} messages`,
            },
          ],
        })),
      },
    ],
  })

  const userInTop =
    topActivity.find((activity) => activity.user_id === userID) !== undefined

  if (!userInTop) {
    const userActivity = (
      await db.userDay.groupBy({
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
    )[0]

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
                gte: userActivity._sum.messages_posted ?? 0,
              },
            },
          },
        })
      ).length + 1

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<@${userID}>: *${userPlace}*.  ${
          userActivity._sum.messages_posted ?? 0
        } messages`,
      },
    })
  }

  return blocks
}

async function generateHome(state: state, userID: string) {
  const blocks: AnyBlock[] = []

  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: 'Welcome to Slack Leaderboard!',
    },
  })

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `WIP, see <#C07FFUNMXUG>`,
    },
  })

  blocks.push({
    type: 'divider',
  })

  const dayLeaderboard = await generateLeaderboard(state, userID)
  blocks.push(...dayLeaderboard)

  return {
    type: 'home' as const,
    blocks,
  }
}

export async function handleAppHome({
  event,
  client,
}: middlewareArguments<'app_home_opened'>) {
  const mostRecent = await mostRecentStatDate()

  const initialState: state = {
    startDate: mostRecent.subtract({ days: 7 }).toString(),
    endDate: mostRecent.toString(),
  }

  await client.views.publish({
    user_id: event.user,
    view: await generateHome(initialState, event.user),
  })
  console.log('Published app home for user', event.user)
}
