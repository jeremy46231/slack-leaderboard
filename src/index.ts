import { db } from "./data/database.ts"
import { app } from "./slack/app.ts"
import { getUserProfile } from "./slack/botAPI.ts"

// Listen for users opening your App Home
app.event('app_home_opened', async ({ event, client }) => {
  await client.views.publish({
    user_id: event.user,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hi <@' + event.user + '>',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `This home was generated for you. Have a random number: \`${Math.round(
              Math.random() * 1e5
            )}\` :D`,
          },
        },
      ],
    },
  })
  console.log('Published app home for user', event.user)
})

async function refreshProfile(id?: string) {
  if (!id) return
  const user = await getUserProfile(id)
  await db.user.upsert({
    where: { user_id: user.user_id },
    update: user,
    create: user,
  })
  console.log('Updated user profile for user', user.user_id)
}

app.event('user_profile_changed', ({ event }) => refreshProfile(event.user.id))
// app.event('message', async ({ event }) => { if ('user' in event) refreshProfile(event.user) })
