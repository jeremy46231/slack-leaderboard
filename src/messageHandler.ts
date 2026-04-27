import type { GenericMessageEvent } from '@slack/types'
import { getCachedUser } from './data/users.ts'
import { app } from './slackAPI/app.ts'
import { generateReport } from './reports/report.tsx'

const REPORT_CHANNEL_ID = 'C09RY3A75JR'

function shouldShowAll(text?: string) {
  const normalized = text?.trim().toLowerCase()
  return normalized === 'all' || normalized === 'all time'
}

function getUserLabel(user: {
  display_name: string | null
  real_name: string | null
  user_id: string
}) {
  return user.display_name || user.real_name || user.user_id
}

app.message(async ({ message, client, logger }) => {
  if (message.channel !== REPORT_CHANNEL_ID) {
    return
  }

  if (message.subtype !== undefined) {
    return
  }

  const userMessage = message as GenericMessageEvent
  const userId = userMessage.user
  if (!userId) {
    return
  }

  if (userMessage.thread_ts) {
    return
  }

  const threadTs = userMessage.ts
  const showAll = shouldShowAll(userMessage.text)

  try {
    const [pngData, user] = await Promise.all([
      generateReport(userId, showAll),
      getCachedUser(userId),
    ])
    const userLabel = getUserLabel(user)
    const suffix = showAll ? ' (all time)' : ''
    const reportLabel = `Slack stats for ${userLabel}${suffix}`

    await client.filesUploadV2({
      channel_id: REPORT_CHANNEL_ID,
      thread_ts: threadTs,
      initial_comment: `<@${userId}>${reportLabel}`,
      filename: showAll ? 'slack-stats-all.png' : 'slack-stats.png',
      file: Buffer.from(pngData),
      title: reportLabel,
    })
  } catch (error) {
    logger.error(error)
    await client.chat.postMessage({
      channel: REPORT_CHANNEL_ID,
      thread_ts: threadTs,
      text: `<@${userId}> I couldn't generate your report right now.`,
    })
  }
})
