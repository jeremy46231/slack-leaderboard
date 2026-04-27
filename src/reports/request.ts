export type ReportMode = 'default' | 'all' | 'stacked'

export type ParsedReportRequest = {
  requestedUserId?: string
  mode: ReportMode
}

const USER_ID_PATTERN = /^(?:<@)?([UW][A-Z0-9]{8,})(?:\|[^>]+)?(?:>)?$/

function parseLeadingUserToken(token?: string) {
  if (!token) {
    return undefined
  }

  const match = token.match(USER_ID_PATTERN)
  return match?.[1]
}

function parseMode(text: string): ReportMode {
  const normalized = text.trim().toLowerCase()

  if (!normalized) {
    return 'default'
  }

  if (normalized === 'all' || normalized === 'all time') {
    return 'all'
  }

  if (normalized === 'stacked') {
    return 'stacked'
  }

  throw new Error(
    'Unsupported report mode. Use default, "all", "all time", or "stacked".'
  )
}

export function parseReportRequest(text?: string): ParsedReportRequest {
  const trimmed = text?.trim() ?? ''

  if (!trimmed) {
    return { mode: 'default' }
  }

  const parts = trimmed.split(/\s+/)
  const requestedUserId = parseLeadingUserToken(parts[0])
  const modeText = requestedUserId ? parts.slice(1).join(' ') : trimmed

  return {
    requestedUserId,
    mode: parseMode(modeText),
  }
}
