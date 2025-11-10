import { app } from './app'
import { type webApi as SlackWebTypes } from '@slack/bolt'

export function convertSlackProfileToDbUser(
  rawProfile: SlackProfile,
  userId: string
) {
  // Parse comma-separated manager IDs into array
  const managerField = rawProfile.fields?.['Xf09727DH1J8']?.value
  const manager = managerField
    ? managerField
        .split(',')
        .map((id: string) => id.trim())
        .filter(Boolean)
    : []

  return {
    user_id: userId,
    display_name: rawProfile.display_name,
    real_name: rawProfile.real_name,
    profile_picture: rawProfile.image_original || rawProfile.image_1024,
    pronouns: rawProfile.pronouns || rawProfile.fields?.['XfD4V9MG3V']?.value,

    title: rawProfile.title,
    phone: rawProfile.phone,
    location: rawProfile.fields?.['Xf01S5PAG9HQ']?.value,
    school: rawProfile.fields?.['Xf0DMGGW01']?.value,
    birthday: rawProfile.fields?.['XfQN2QL49W']?.value,
    manager,

    website_url: rawProfile.fields?.['Xf5LNGS86L']?.value,
    website_url_alt: rawProfile.fields?.['Xf5LNGS86L']?.alt,
    scrapbook_url: rawProfile.fields?.['Xf017187T1MW']?.value,
    scrapbook_url_alt: rawProfile.fields?.['Xf017187T1MW']?.alt,
    github_url: rawProfile.fields?.['Xf0DMHFDQA']?.value,
    github_url_alt: rawProfile.fields?.['Xf0DMHFDQA']?.alt,
    ham_callsign: rawProfile.fields?.['Xf068DMM22JE']?.value,
    matrix_username: rawProfile.fields?.['Xf070L2HH7BJ']?.value,
    bluesky_url: rawProfile.fields?.['Xf09A3EBEJ9Z']?.value,
    bluesky_url_alt: rawProfile.fields?.['Xf09A3EBEJ9Z']?.alt,
    social_account_url: rawProfile.fields?.['Xf09A42WSW9Z']?.value,
    social_account_url_alt: rawProfile.fields?.['Xf09A42WSW9Z']?.alt,

    favorite_channels: rawProfile.fields?.['XfM1701Z9V']?.value,
    favorite_foods: rawProfile.fields?.['Xf0191PM1588']?.value,
    favorite_artists: rawProfile.fields?.['Xf01921WR26N']?.value,
    favorite_activities: rawProfile.fields?.['Xf01SBU8GWP6']?.value,
    favorite_tools: rawProfile.fields?.['Xf01S5PRFAQJ']?.value,
    dog_cat_infra: rawProfile.fields?.['Xf06851X9ZEX']?.value,
    pfp_credit: rawProfile.fields?.['Xf081WUQUEE4']?.value,

    gold_since: rawProfile.fields?.['Xf0914LDUG8G']?.value,
    club_rank: rawProfile.fields?.['Xf095HANS25U']?.value,

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
