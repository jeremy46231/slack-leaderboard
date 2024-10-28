import { db } from './data/database.ts'
import { getUserProfile } from './slackAPI/botAPI.ts'

export async function refreshProfile(id?: string) {
  if (!id) return
  const user = await getUserProfile(id)
  await db.user.upsert({
    where: { user_id: user.user_id },
    update: user,
    create: user,
  })
  console.log('Updated user profile for user', user.user_id)
}
