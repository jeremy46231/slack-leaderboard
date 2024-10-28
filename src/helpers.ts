import type { Middleware, SlackEventMiddlewareArgs, StringIndexed } from '@slack/bolt'
import { Temporal } from 'temporal-polyfill'

export type middlewareArguments<type extends string> = Parameters<Middleware<SlackEventMiddlewareArgs<type>, StringIndexed>>[0]
export type AnyBlock = Parameters<typeof import('./slackAPI/app.ts').app.client.views.publish>[0]['view']['blocks'][0]

export async function runThreaded<T extends unknown>(
  items: Iterable<T>,
  total: number,
  threadCount: number,
  callback: (item: T) => Promise<void>
) {
  const iterator = items[Symbol.iterator]()
  let completed = 0

  async function thread() {
    let current = iterator.next()
    while (!current.done) {
      await callback(current.value)

      completed++
      const percentString = ((completed / total) * 100).toFixed(1).padStart(5)
      const totalString = total.toFixed()
      const completeString = completed.toFixed().padStart(totalString.length)
      console.log(
        `${percentString}% (${completeString}/${totalString}) complete`
      )

      current = iterator.next()
    }
  }

  const threads = Array.from({ length: threadCount }, (_, i) => thread())
  await Promise.all(threads)
}

export function* daysGenerator(
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate
) {
  if (Temporal.PlainDate.compare(startDate, endDate) > 0) {
    throw new Error('Start date is after end date')
  }
  for (
    let date = startDate;
    Temporal.PlainDate.compare(date, endDate) <= 0;
    date = date.add({ days: 1 })
  ) {
    yield date
  }
}

export function plainDateToString(date: Temporal.PlainDate) {
  return date.toZonedDateTime('UTC').toInstant().toString()
}
export function jsDateToPlainDate(date: Date) {
  return Temporal.Instant.fromEpochMilliseconds(date.getTime())
    .toZonedDateTimeISO('UTC')
    .toPlainDate()
}
