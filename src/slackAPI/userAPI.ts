import { backOff } from 'exponential-backoff'
import { Temporal } from 'temporal-polyfill'

const slackCookie = process.env['SLACK_USER_COOKIE']!
const userToken = process.env['SLACK_USER_TOKEN']!
const slackDomain = process.env['SLACK_DOMAIN']!

if (!slackCookie || !userToken || !slackDomain) {
  throw new Error('Missing required environment variables for scraping stats')
}

async function plainSlackBrowserAPI(
  method: string,
  params: [name: string, value: string][]
) {
  const url = new URL(`/api/${method}`, slackDomain)
  const formData = new FormData()
  formData.set('token', userToken)
  for (const [name, value] of params) {
    formData.set(name, value)
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    body: formData,
    headers: {
      Cookie: `d=${encodeURIComponent(slackCookie)}`,
    },
  })
  if (!response.ok) {
    try {
      const text = await response.text()
      console.error('Failed to fetch Slack API, fail text:', response.status, text)
    } catch {}
    throw new Error('Failed to fetch Slack API, fail: ' + response.statusText)
  }
  const json = (await response.json()) as { ok: boolean } & Record<string, any>
  if (!json.ok) {
    console.error('Failed to fetch Slack API, json:', json)
    throw new Error('Failed to fetch Slack API, json: ' + JSON.stringify(json))
  }

  return json
}

export async function slackBrowserAPI(
  method: string,
  params: [name: string, value: string][]
) {
  const response = await backOff(() => plainSlackBrowserAPI(method, params), {
    numOfAttempts: 50, // if it doesn't cool off after 20 minutes, it's not going to
    startingDelay: 500,
    maxDelay: 30_000,
  })
  return response
}

type StatsAPIResponse = {
  ok: boolean
  next_cursor_mark: string
  num_found: number
  member_activity: {
    user_id: string

    team_id: string
    username: string
    date_created: number
    is_primary_owner: boolean
    is_owner: boolean
    is_admin: boolean
    is_restricted: boolean
    is_ultra_restricted: boolean
    is_invited_member: boolean
    is_invited_guest: boolean
    real_name: string
    display_name: string
    user_title?: string
    workspaces: {
      [key: string]: string
    }
    date_claimed: number
    is_billable_seat: boolean

    messages_posted_in_channel: number
    reactions_added: number
    days_active: number
    days_active_desktop: number
    days_active_android: number
    days_active_ios: number
    files_added_count: number
    messages_posted: number

    date_last_active: number
    date_last_active_ios: number
    date_last_active_android: number
    date_last_active_desktop: number

    days_active_apps: 0
    days_active_workflows: 0
    days_active_slack_connect: 0
    total_calls_count: 0
    slack_calls_count: 0
    slack_huddles_count: 0
    search_count: 0
  }[]
}

export async function getRangeStats(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  maxResults = 2000
) {
  const json = (await slackBrowserAPI('admin.analytics.getMemberAnalytics', [
    ['token', userToken],
    ['start_date', startDate.toString()],
    ['end_date', endDate.toString()],
    ['count', maxResults.toFixed()],
    ['sort_column', 'messages_posted'],
    ['sort_direction', 'desc'],
  ])) as StatsAPIResponse

  const active = json.member_activity
    .filter(
      (member) =>
        member.days_active > 0 ||
        member.messages_posted > 0 ||
        member.reactions_added > 0 ||
        member.files_added_count > 0
    )
    .map((member) => ({
      user_id: member.user_id,
      days_active: member.days_active,
      days_active_desktop: member.days_active_desktop,
      days_active_ios: member.days_active_ios,
      days_active_android: member.days_active_android,
      messages_posted: member.messages_posted,
      messages_posted_in_channel: member.messages_posted_in_channel,
      reactions_added: member.reactions_added,
      files_added_count: member.files_added_count,
    }))
  return active
}

export async function getAvailableDates() {
  const json = (await slackBrowserAPI('admin.analytics.getAvailableDateRange', [
    ['type', 'member'],
  ])) as {
    ok: boolean
    start_date: string
    end_date: string
    date_last_updated: number
    date_last_indexed: number
  }

  return {
    start_date: Temporal.PlainDate.from(json.start_date),
    end_date: Temporal.PlainDate.from(json.end_date),
    date_last_updated: Temporal.Instant.fromEpochMilliseconds(
      json.date_last_updated * 1000
    ),
    date_last_indexed: Temporal.Instant.fromEpochMilliseconds(
      json.date_last_indexed * 1000
    ),
  }
}
