import { Temporal } from 'temporal-polyfill'

const slackCookie = process.env.SLACK_USER_COOKIE!
const userToken = process.env.SLACK_USER_TOKEN!
const slackDomain = process.env.SLACK_DOMAIN!

if (!slackCookie || !userToken || !slackDomain) {
  throw new Error('Missing required environment variables for scraping stats')
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
  maxResults = 5000
) {
  const url = new URL('/api/admin.analytics.getMemberAnalytics', slackDomain)
  const formData = new FormData()
  formData.set('token', userToken)
  formData.set('start_date', startDate.toString())
  formData.set('end_date', endDate.toString())
  formData.set('count', maxResults.toFixed())
  formData.set('sort_column', 'messages_posted')
  formData.set('sort_direction', 'desc')
  // formData.set('query', '')

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
      console.error('Failed to fetch stats:', response.status, text)
    } catch {}
    throw new Error('Failed to fetch stats: ' + response.statusText)
  }
  const json = (await response.json()) as StatsAPIResponse
  if (!json.ok) {
    console.error('Failed to fetch stats:', json)
    throw new Error('Failed to fetch stats: ' + JSON.stringify(json))
  }

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

export type dayRecord = {
  user_id: string
  date: string
  is_active: boolean
  is_desktop: boolean
  is_ios: boolean
  is_android: boolean
  messages_posted: number
  messages_posted_in_channel: number
  reactions_added: number
}

export async function getDayStats(
  day: Temporal.PlainDate
): Promise<dayRecord[]> {
  const data = await getRangeStats(day, day)
  const converted = data.map((member) => ({
    user_id: member.user_id,
    date: day.toString(),
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

export async function getStats(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate
): Promise<dayRecord[]> {
  const stats: dayRecord[] = []
  for (
    let date = startDate;
    Temporal.PlainDate.compare(date, endDate) <= 0;
    date = date.add({ days: 1 })
  ) {
    console.log('Fetching stats for', date.toString())
    const dayStats = await getDayStats(date)
    stats.push(...dayStats)
  }
  return stats
}

const end = Temporal.Now.plainDate('iso8601').subtract({ days: 3 })
const start = end.subtract({ days: 7 })
const stats = await getStats(start, end)

require('fs').writeFileSync('temp_stats.json', JSON.stringify(stats))
