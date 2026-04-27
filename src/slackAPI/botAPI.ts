import { app } from './app'
import { type webApi as SlackWebTypes } from '@slack/bolt'

export function convertSlackProfileToDbUser(
  rawProfile: SlackProfile,
  userId: string
) {
  return {
    user_id: userId,
    display_name: rawProfile.display_name,
    real_name: rawProfile.real_name,
    profile_picture: rawProfile.image_original || rawProfile.image_1024,
    last_updated: new Date(),
  }
}

export async function getUserProfile(userId: string) {
  const response = await app.client.users.profile.get({
    user: userId,
  })
  if (!response.ok || !response.profile) {
    throw new Error('Failed to fetch user profile: ' + response.error)
  }

  return convertSlackProfileToDbUser(response.profile, userId)
}

export type SlackProfile = NonNullable<
  SlackWebTypes.UsersProfileGetResponse['profile']
>
export type User = Awaited<ReturnType<typeof getUserProfile>>
