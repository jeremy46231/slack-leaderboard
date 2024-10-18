import { App as SlackApp } from '@slack/bolt'

const app = new SlackApp({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
})

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

await app.start()
console.log('⚡️ Bolt app is running!')