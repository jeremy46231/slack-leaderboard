import { Temporal } from 'temporal-polyfill'
import { db } from './database.ts'
import { getUserProfile } from '../slackAPI/botAPI.ts'

const DEFAULT_USER_CACHE_MAX_AGE = Temporal.Duration.from({ days: 3 })

function cutoffDate(maxAge: Temporal.Duration) {
  return new Date(
    Temporal.Now.zonedDateTimeISO('UTC')
      .subtract(maxAge)
      .toInstant().epochMilliseconds
  )
}

export async function getCachedUser(
  userId: string,
  maxAge = DEFAULT_USER_CACHE_MAX_AGE
) {
  const cachedUser = await db.user.findUnique({
    where: { user_id: userId },
  })

  if (cachedUser && cachedUser.last_updated >= cutoffDate(maxAge)) {
    return cachedUser
  }

  const profile = await getUserProfile(userId)

  return db.user.upsert({
    where: { user_id: profile.user_id },
    create: profile,
    update: profile,
  })
}

export async function refreshCachedUser(userId: string) {
  const profile = await getUserProfile(userId)

  return db.user.upsert({
    where: { user_id: profile.user_id },
    create: profile,
    update: profile,
  })
}
