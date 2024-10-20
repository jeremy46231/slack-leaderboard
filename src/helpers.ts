export async function runThreaded<T extends unknown>(
  items: Generator<T, void, unknown> | Iterable<T>,
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
      console.log(`${percentString}% (${completeString}/${totalString}) complete`)

      current = iterator.next()
    }
  }

  const threads = Array.from({ length: threadCount }, (_, i) => thread())
  await Promise.all(threads)
}
