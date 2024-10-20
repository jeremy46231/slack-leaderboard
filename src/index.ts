import { app } from "./slack/app"

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

