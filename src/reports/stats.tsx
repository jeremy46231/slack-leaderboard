import type { dayInfo } from './report'

function percent(numerator: number, denominator: number) {
  if (denominator === 0) return 0
  return Math.round((numerator / denominator) * 100)
}

function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}

function formatPlatformUsage(
  platformStats: Array<{ label: string; firstLabel: string; value: number }>
) {
  const [firstPlatform, ...otherPlatforms] = platformStats
  if (!firstPlatform) {
    throw new Error('At least one platform stat is required')
  }

  return `${firstPlatform.value}% of active days ${firstPlatform.firstLabel}${otherPlatforms.length > 0 ? `, ${otherPlatforms.map((platform) => `${platform.value}% ${platform.label}`).join(', ')}` : ''}`
}

export function makeStatsWidget(userDays: dayInfo[]) {
  const daysOnline = userDays.filter((day) => day.is_active).length
  const daysReacted = userDays.filter((day) => day.reactions_added > 0).length
  const daysMessaged = userDays.filter((day) => day.messages_posted > 0).length

  const totalMessages = userDays.reduce(
    (sum, day) => sum + day.messages_posted,
    0
  )
  const totalPublicMessages = userDays.reduce(
    (sum, day) => sum + day.messages_posted_in_channel,
    0
  )
  const totalReactions = userDays.reduce(
    (sum, day) => sum + day.reactions_added,
    0
  )

  const activeDays = Math.max(1, daysOnline)
  const desktopDays = userDays.filter((day) => day.is_desktop).length
  const iosDays = userDays.filter((day) => day.is_ios).length
  const androidDays = userDays.filter((day) => day.is_android).length
  const platformStats = [
    {
      label: 'desktop app',
      firstLabel: 'used the desktop app',
      value: percent(desktopDays, activeDays),
    },
    {
      label: 'iOS',
      firstLabel: 'used iOS',
      value: percent(iosDays, activeDays),
    },
    {
      label: 'Android',
      firstLabel: 'used Android',
      value: percent(androidDays, activeDays),
    },
  ].sort((a, b) => b.value - a.value)
  const dayActivityStats = [
    { label: 'days reacted', value: daysReacted },
    { label: 'days messaged', value: daysMessaged },
  ].sort((a, b) => b.value - a.value)

  const lines = [
    `${formatNumber(daysOnline)} days online, ${formatNumber(dayActivityStats[0]!.value)} ${dayActivityStats[0]!.label}, ${formatNumber(dayActivityStats[1]!.value)} ${dayActivityStats[1]!.label}`,
    `${formatNumber(totalMessages)} total messages (${formatNumber(totalPublicMessages)} in channel), ${formatNumber(totalReactions)} reactions`,
    formatPlatformUsage(platformStats),
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontFamily: 'Roboto',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#374151',
        width: '100%',
        height: '100%',
      }}
    >
      {lines.map((line) => (
        <div
          key={line}
          style={{
            textAlign: 'right',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  )
}
