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
    pronouns:
      response.profile.pronouns ||
      response.profile.fields?.['XfD4V9MG3V']?.value,

    title: response.profile.title,
    phone: response.profile.phone,
    location: response.profile.fields?.['Xf01S5PAG9HQ']?.value,
    school: response.profile.fields?.['Xf0DMGGW01']?.value,
    birthday: response.profile.fields?.['XfQN2QL49W']?.value,
    website_url: response.profile.fields?.['Xf5LNGS86L']?.value,
    scrapbook_url: response.profile.fields?.['Xf017187T1MW']?.value,
    github_url: response.profile.fields?.['Xf0DMHFDQA']?.value,
    ham_callsign: response.profile.fields?.['Xf068DMM22JE']?.value,
    matrix_username: response.profile.fields?.['Xf070L2HH7BJ']?.value,

    favorite_channels: response.profile.fields?.['XfM1701Z9V']?.value,
    favorite_foods: response.profile.fields?.['Xf0191PM1588']?.value,
    favorite_artists: response.profile.fields?.['Xf01921WR26N']?.value,
    favorite_activities: response.profile.fields?.['Xf01SBU8GWP6']?.value,
    favorite_tools: response.profile.fields?.['Xf01S5PRFAQJ']?.value,
    dog_cat_infra: response.profile.fields?.['Xf06851X9ZEX']?.value,
  }
}

export type User = Awaited<ReturnType<typeof getUserProfile>>
