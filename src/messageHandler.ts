import type { GenericMessageEvent } from '@slack/types'
import { getCachedUser } from './data/users.ts'
import { app } from './slackAPI/app.ts'
import { generateReport } from './reports/report.tsx'
import { parseReportRequest } from './reports/request.ts'

const BOT_USER_ID = 'U07SAUMSCAH'
const REPORT_CHANNEL_ID = 'C09RY3A75JR'

function getUserLabel(user: {
  display_name: string | null
  real_name: string | null
  user_id: string
}) {
  return user.display_name || user.real_name || user.user_id
}

function stripLeadingBotMention(text?: string) {
  const trimmed = text?.trim()
  if (!trimmed) {
    return undefined
  }

  const mentionPrefix = `<@${BOT_USER_ID}>`
  if (!trimmed.startsWith(mentionPrefix)) {
    return undefined
  }

  return trimmed.slice(mentionPrefix.length).trim()
}

async function handleReportRequest({
  message,
  client,
  logger,
  requestText,
  responseChannelId,
  responseThreadTs,
}: {
  message: GenericMessageEvent
  client: {
    filesUploadV2: typeof app.client.filesUploadV2
    chat: typeof app.client.chat
  }
  logger: {
    error: (error: unknown) => void
  }
  requestText?: string
  responseChannelId: string
  responseThreadTs: string
}) {
  const userId = message.user
  if (!userId) {
    return
  }

  const { requestedUserId, mode } = parseReportRequest(requestText)
  const targetUserId = requestedUserId ?? userId

  try {
    const [pngData, user] = await Promise.all([
      generateReport(targetUserId, mode),
      getCachedUser(targetUserId),
    ])
    const userLabel = getUserLabel(user)
    const suffix =
      mode === 'all' ? ' (all time)' : mode === 'stacked' ? ' (stacked)' : ''
    const reportLabel = `Slack stats for ${userLabel}${suffix}`
    const requesterSuffix =
      targetUserId === userId ? '' : ` (requested by <@${userId}>)`

    await client.filesUploadV2({
      channel_id: responseChannelId,
      thread_ts: responseThreadTs,
      initial_comment: `<@${targetUserId}>${suffix}${requesterSuffix}`,
      filename:
        mode === 'all'
          ? 'slack-stats-all.png'
          : mode === 'stacked'
            ? 'slack-stats-stacked.png'
            : 'slack-stats.png',
      file: Buffer.from(pngData),
      title: reportLabel,
    })
  } catch (error) {
    logger.error(error)
    await client.chat.postMessage({
      channel: responseChannelId,
      thread_ts: responseThreadTs,
      text: `<@${userId}> I couldn't generate your report right now.`,
    })
  }
}

app.event('app_mention', async ({ event, client, logger }) => {
  await handleReportRequest({
    message: event as GenericMessageEvent,
    client,
    logger,
    requestText: stripLeadingBotMention(event.text),
    responseChannelId: event.channel,
    responseThreadTs: event.thread_ts ?? event.ts,
  })
})

app.message(async ({ message, client, logger }) => {
  if (message.subtype !== undefined) {
    return
  }

  const userMessage = message as GenericMessageEvent
  if (stripLeadingBotMention(userMessage.text) !== undefined) {
    return
  }

  if (userMessage.channel !== REPORT_CHANNEL_ID) {
    return
  }

  if (userMessage.thread_ts) {
    return
  }

  await handleReportRequest({
    message: userMessage,
    client,
    logger,
    requestText: userMessage.text,
    responseChannelId: REPORT_CHANNEL_ID,
    responseThreadTs: userMessage.ts,
  })
})
