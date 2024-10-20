import { db } from './database.ts'
import { getUserProfile } from '../slack/botAPI.ts'

export async function addUsersToDB(userIDs: string[]) {
  
}

export async function getUserIDs() {
  const userIDs = await db.userDay.findFirst({
    where: {
      user: { isNot: {} }
    },
  })
  console.log(userIDs)
}
await getUserIDs()
