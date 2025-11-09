import { app } from './app'

export async function getUserProfile(userId: string) {
  const response = await app.client.users.profile.get({
    user: userId,
  })
  if (!response.ok || !response.profile) {
    throw new Error('Failed to fetch user profile: ' + response.error)
  }

  // Parse comma-separated manager IDs into array
  const managerField = response.profile.fields?.['Xf09727DH1J8']?.value
  const manager = managerField
    ? managerField
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    : []

  return {
    user_id: userId,
    display_name: response.profile.display_name,
    real_name: response.profile.real_name,
    profile_picture:
      response.profile.image_original || response.profile.image_1024,
    pronouns:
      response.profile.pronouns ||
      response.profile.fields?.['XfD4V9MG3V']?.value,

    title: response.profile.title,
    phone: response.profile.phone,
    location: response.profile.fields?.['Xf01S5PAG9HQ']?.value,
    school: response.profile.fields?.['Xf0DMGGW01']?.value,
    birthday: response.profile.fields?.['XfQN2QL49W']?.value,
    manager,

    website_url: response.profile.fields?.['Xf5LNGS86L']?.value,
    website_url_alt: response.profile.fields?.['Xf5LNGS86L']?.alt,
    scrapbook_url: response.profile.fields?.['Xf017187T1MW']?.value,
    scrapbook_url_alt: response.profile.fields?.['Xf017187T1MW']?.alt,
    github_url: response.profile.fields?.['Xf0DMHFDQA']?.value,
    github_url_alt: response.profile.fields?.['Xf0DMHFDQA']?.alt,
    ham_callsign: response.profile.fields?.['Xf068DMM22JE']?.value,
    matrix_username: response.profile.fields?.['Xf070L2HH7BJ']?.value,
    bluesky_url: response.profile.fields?.['Xf09A3EBEJ9Z']?.value,
    bluesky_url_alt: response.profile.fields?.['Xf09A3EBEJ9Z']?.alt,
    social_account_url: response.profile.fields?.['Xf09A42WSW9Z']?.value,
    social_account_url_alt: response.profile.fields?.['Xf09A42WSW9Z']?.alt,

    favorite_channels: response.profile.fields?.['XfM1701Z9V']?.value,
    favorite_foods: response.profile.fields?.['Xf0191PM1588']?.value,
    favorite_artists: response.profile.fields?.['Xf01921WR26N']?.value,
    favorite_activities: response.profile.fields?.['Xf01SBU8GWP6']?.value,
    favorite_tools: response.profile.fields?.['Xf01S5PRFAQJ']?.value,
    dog_cat_infra: response.profile.fields?.['Xf06851X9ZEX']?.value,
    pfp_credit: response.profile.fields?.['Xf081WUQUEE4']?.value,

    gold_since: response.profile.fields?.['Xf0914LDUG8G']?.value,
    club_rank: response.profile.fields?.['Xf095HANS25U']?.value,

    last_updated: new Date(),
  }
}

export type User = Awaited<ReturnType<typeof getUserProfile>>
