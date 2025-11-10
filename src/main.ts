import { app } from './slackAPI/app.ts'
import { handleAppHome } from './appHome.ts'
import { updateStats, refreshOldUserProfiles } from './data/getStats.ts'
import { Temporal } from 'temporal-polyfill'
import { convertSlackProfileToDbUser, type SlackProfile } from './slackAPI/botAPI.ts'
import { db } from './data/database.ts'

app.event('app_home_opened', handleAppHome)

app.event('user_profile_changed', async ({ event }) => {
  const userId = event.user.id
  const rawProfile = event.user.profile as SlackProfile
  if (!rawProfile) {
    console.error('No profile data in user_profile_changed event')
    return
  }
  if (rawProfile.fields === null) {
    console.error('No custom fields in user profile for user:', userId)
    return
  }
  const profile = convertSlackProfileToDbUser(rawProfile, userId)
  await db.user.upsert({
    where: { user_id: profile.user_id },
    create: profile,
    update: profile,
  })
})

const HOUR_MS = 60 * 60 * 1000

async function hourlyTasks() {
  console.log('Running hourly tasks...')

  try {
    await updateStats()
  } catch (error) {
    console.error('Error updating stats:', error)
  }

  try {
    await refreshOldUserProfiles(Temporal.Duration.from({ days: 7 }), 200)
  } catch (error) {
    console.error('Error refreshing old user profiles:', error)
  }

  console.log('Hourly tasks completed')
}

// Run tasks immediately on startup
hourlyTasks()

// Schedule hourly tasks
setInterval(hourlyTasks, HOUR_MS)
