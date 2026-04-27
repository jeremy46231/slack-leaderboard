import { app } from './app'

export async function getUserProfile(userId: string) {
  const response = await app.client.users.profile.get({
    user: userId,
  })
  if (!response.ok || !response.profile) {
    throw new Error('Failed to fetch user profile: ' + response.error)
  }

  return {
    user_id: userId,
    display_name: response.profile.display_name,
    real_name: response.profile.real_name,
    profile_picture:
      response.profile.image_original || response.profile.image_1024,
    last_updated: new Date(),
  }
}

export type User = Awaited<ReturnType<typeof getUserProfile>>
