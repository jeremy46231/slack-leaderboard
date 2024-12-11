import { app } from './slackAPI/app.ts'
// import { refreshProfile } from './profileWatcher.ts'
import { Home } from './components/Home.tsx'
import Reblock from 'reblock-js'

Reblock.appHome(app, (userID) => <Home userID={userID} />)

// app.event('user_profile_changed', ({ event }) => refreshProfile(event.user.id))

await app.start()
