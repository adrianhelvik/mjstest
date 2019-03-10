import chalk from 'chalk'

export default function runSuite(suite, options) {
  const results = []
  const listeners = { 'spec result': [] }
  const emit = (event, payload) => {
    for (const fn of listeners[event])
      fn(payload)
  }
  const promise = runSingleSuite(suite)
  promise.on = (event, callback) => {
    listeners[event].push(callback)
    return promise
  }
  return promise

  async function runSingleSuite(suite, name = []) {
    // Wait until the next iteration of the
    // event loop, as event handlers must
    // be set up first.
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })

    for (const child of suite.children) {
      const nextName = name.concat(child.name)

      switch (child.type) {
        case 'spec':
          let result
          try {
            await child.fn()
            result = {
              type: 'success',
              name: nextName,
            }
          } catch (e) {
            var stack = e.message
            result = {
              type: 'error',
              message: e.message,
              stack: e.stack,
              name: nextName,
            }
          }
          try {
            emit('spec result', result)
          } catch (e) {
            console.error(chalk.bgRed(`An error occurred in onSpecResult: ${e.message}`))
          }
          results.push(result)
          break
        case 'suite':
          await runSingleSuite(child, nextName)
          break
        default:
          console.warn(
            chalk.yellow(
              chalk.bold(`\n!!! Unhandled node type "${child.type}" !!!\n`)
            )
          )
      }
    }
    return results
  }
}
