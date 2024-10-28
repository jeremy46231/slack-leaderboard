import { app } from "./slackAPI/app.ts"
import { refreshProfile } from "./profileWatcher.ts"
import { handleAppHome } from "./appHome.ts"

app.event('app_home_opened', handleAppHome)

app.event('user_profile_changed', ({ event }) =>
  refreshProfile(event.user.id)
)