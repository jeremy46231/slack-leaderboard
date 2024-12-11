import { Leaderboard } from './Leaderboard.tsx'

export function Home({ userID }: { userID: string }) {
  console.log(`Rendering Home for ${userID}`)
  return (
    <>
      <h1>Slack Leaderboard</h1>
      <rich>
        Hello <user>{userID}</user>!
      </rich>
      <hr />
      <Leaderboard userID={userID} />
    </>
  )
}
