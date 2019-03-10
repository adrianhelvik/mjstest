import DefaultReporter from './defaultReporter.mjs'
import gatherSpecs from './gatherSpecs.mjs'
import runSuite from './runSuite.mjs'
import glob from 'glob-promise'
import assert from 'assert'
import chalk from 'chalk'

export default async function runTests(pattern, options = {}) {
  if (! options || typeof options !== 'object')
    options = {}
  if (! options.reporter)
    options.reporter = new DefaultReporter()
  const { reporter, ...reporterOptions } = options
  reporter.setOptions(reporterOptions)

  if (! pattern.startsWith('/'))
    throw Error('You must run tests using a absolute path pattern (eg. /users/foo/**/*.spec.js).')
  const files = await glob(pattern)
  if (! glob.hasMagic(pattern))
    reporter.println(chalk.yellow(chalk.bold('Warning: You are running tests without a glob pattern. See the docs for glob regarding allowed patterns.')))
  const importFailures = []
  const allFileResults = []
  const allResults = []
  let success = true

  reporter.onBeforeTests(files)

  for (const file of files) {
    let fileSuccess = true
    reporter.onBeforeFile(file)

    let specs
    try {
      specs = await gatherSpecs(file)
    } catch (e) {
      importFailures.push({
        file,
        stack: e.message
      })
      success = false
      continue
    }

    const results = await runSuite(specs)
      .on('spec result', result => {
        try {
          if (result.type === 'error') {
            fileSuccess = false
            success = false
          }
          allResults.push(result)
          reporter.onSpecResult(result)
        } catch (e) {
          fileSuccess = false
          success = false
          reporter.println(
            chalk.bgRed(`Failed to add spec result: ${e.message}`)
          )
        }
      })
    const fileResults = {
      success: fileSuccess,
      results,
      file,
    }
    allFileResults.push(fileResults)
    reporter.onFileResults(fileResults)
  }

  reporter.onTestsComplete({
    fileResults: allFileResults,
    results: allResults,
    importFailures,
    success,
  })
}
