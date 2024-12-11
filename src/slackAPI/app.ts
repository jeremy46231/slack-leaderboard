import { App as SlackApp } from '@slack/bolt'

export const app = new SlackApp({
  token: process.env['SLACK_BOT_TOKEN'],
  signingSecret: process.env['SLACK_SIGNING_SECRET'],
  appToken: process.env['SLACK_APP_TOKEN'],
  socketMode: true,
})

const auth = await app.client.auth.test()
if (!auth.ok) {
  throw new Error('Failed to authenticate with Slack')
}
