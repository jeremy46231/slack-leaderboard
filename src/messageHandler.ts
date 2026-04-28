import type { GenericMessageEvent } from '@slack/types'
import { getCachedUser } from './data/users.ts'
import { app } from './slackAPI/app.ts'
import {
  generateReport,
  generateReportCsv,
  generateReportImage,
} from './reports/report.tsx'
import { parseReportRequest, type ReportMode } from './reports/request.ts'

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

function getReportSuffix(mode: ReportMode) {
  if (mode === 'all') {
    return ' (all time)'
  }

  if (mode === 'stacked') {
    return ' (stacked)'
  }

  if (mode === 'csv') {
    return ' (raw data)'
  }

  return ''
}

function getReportFilename(mode: ReportMode) {
  if (mode === 'all') {
    return 'slack-stats-all.png'
  }

  if (mode === 'stacked') {
    return 'slack-stats-stacked.png'
  }

  if (mode === 'csv') {
    return 'slack-stats-raw-data.csv'
  }

  return 'slack-stats.png'
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
    const suffix = getReportSuffix(mode)
    const requesterSuffix =
      targetUserId === userId ? '' : ` (requested by <@${userId}>)`

    if (mode === 'csv') {
      const { user, userDays } = await generateReport(targetUserId, mode)
      const reportLabel = `Slack stats for ${getUserLabel(user)}${suffix}`

      await client.filesUploadV2({
        channel_id: responseChannelId,
        thread_ts: responseThreadTs,
        initial_comment: `<@${targetUserId}>${suffix}${requesterSuffix}`,
        filename: getReportFilename(mode),
        file: Buffer.from(generateReportCsv(userDays), 'utf8'),
        title: reportLabel,
      })

      return
    }

    const user = await getCachedUser(targetUserId)
    const pngData = await generateReportImage(targetUserId, mode)
    const reportLabel = `Slack stats for ${getUserLabel(user)}${suffix}`

    await client.filesUploadV2({
      channel_id: responseChannelId,
      thread_ts: responseThreadTs,
      initial_comment: `<@${targetUserId}>${suffix}${requesterSuffix}`,
      filename: getReportFilename(mode),
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
    message: event as unknown as GenericMessageEvent,
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
