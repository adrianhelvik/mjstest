import chalk from 'chalk'

export default function runSuite(suite, options) {
  const promise = runSingleSuite(suite)
  const listeners = { 'spec result': [] }
  const results = []
  promise.on = (event, callback) => {
    listeners[event].push(callback)
    return promise
  }
  const emit = (event, payload) => {
    for (const fn of listeners[event])
      fn(payload)
  }
  return promise

  async function runSingleSuite(suite, name = []) {

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
            result = {
              type: 'error',
              stack: e.stack,
              name: nextName,
            }
          }
          emit('spec result', result)
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
