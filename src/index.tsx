import { app } from './slackAPI/app.ts'
// import { refreshProfile } from './profileWatcher.ts'

// app.event('user_profile_changed', ({ event }) => refreshProfile(event.user.id))

await app.start()
