import { db } from './data/database.ts'
import { getUserProfile } from './slackAPI/botAPI.ts'

export async function refreshProfile(id?: string) {
  if (!id) return
  const profile = await getUserProfile(id)

  await db.user.upsert({
    where: { user_id: profile.user_id },
    create: profile,
    update: profile,
  })
  console.log('Updated user profile for user', profile.user_id)
}
