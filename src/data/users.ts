import { Temporal } from 'temporal-polyfill'
import { db } from './database.ts'
import {
  getUserProfile,
  isSlackUserNotFoundError,
} from '../slackAPI/botAPI.ts'

const DEFAULT_USER_CACHE_MAX_AGE = Temporal.Duration.from({ days: 3 })

function cutoffDate(maxAge: Temporal.Duration) {
  return new Date(
    Temporal.Now.zonedDateTimeISO('UTC').subtract(maxAge).toInstant()
      .epochMilliseconds
  )
}

async function markUserMissing(userId: string) {
  return db.user.upsert({
    where: { user_id: userId },
    create: {
      user_id: userId,
      display_name: null,
      real_name: null,
      profile_picture: null,
      last_updated: new Date(),
    },
    update: {
      last_updated: new Date(),
    },
  })
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

  try {
    const profile = await getUserProfile(userId)

    return db.user.upsert({
      where: { user_id: profile.user_id },
      create: profile,
      update: profile,
    })
  } catch (error) {
    if (isSlackUserNotFoundError(error)) {
      return markUserMissing(userId)
    }
    throw error
  }
}

export async function refreshCachedUser(userId: string) {
  try {
    const profile = await getUserProfile(userId)

    return db.user.upsert({
      where: { user_id: profile.user_id },
      create: profile,
      update: profile,
    })
  } catch (error) {
    if (isSlackUserNotFoundError(error)) {
      return markUserMissing(userId)
    }
    throw error
  }
}
