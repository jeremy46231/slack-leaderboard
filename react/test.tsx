import React from 'react'
import { app } from '../src/slackAPI/app.ts'
import { appHome } from './slack_react.tsx'

let increment: () => void = () => {}

function TestComponent() {
  const [count, setCount] = React.useState(0)
  increment = () => setCount(count + 1)
  return (
    <>
      <ol>
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>{i}</li>
        ))}
      </ol>
    </>
  )
}

await app.client.views.publish({
  user_id: 'U06UYA5GMB5',
  view: appHome(
    <>
      <h1>Hello *World*</h1>
      <rich>
        <ol>
          <li>one</li>
          <ol>
            <li>sub</li>
          </ol>
          <li>two</li>
        </ol>
      </rich>
    </>
  ),
})
process.exit(0)