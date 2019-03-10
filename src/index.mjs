import gatherSpecs from './gatherSpecs.mjs'
import runSuite from './runSuite.mjs'
import glob from 'glob-promise'
import assert from 'assert'
import chalk from 'chalk'

const FULL_CLEAR = '\x1b[2J'
const CLEAR = '\x1b[0f'

const defaultReporter = Object.freeze({
  print(message) {
    process.stdout.write(message)
  },
  println(message) {
    process.stdout.write(message + '\n')
  },
  onBeforeTests(files) {
    this.print(FULL_CLEAR)
    this.print(CLEAR)
    this.println(chalk.bold.gray('Running tests'))
    this.println('')
  },
  onBeforeFile(file) {
    const message = `${file.replace(process.cwd(), '.')}`
    this.println(chalk.bold(message))
  },
  onSpecResult(result) {
    if (result.type === 'success') {
      this.print(chalk.green('✓'))
    } else {
      this.print(chalk.red('✗'))
    }
  },
  onFileResults({ file, results, success }) {
    if (! results.length)
      this.println(chalk.yellow.bold(`No tests found in ${file.replace(process.cwd(), '.')}`))
    else
      this.println('')

    this.println('')

    if (success)
      return

    this.println(chalk.red.bold(`Failures in ${file.replace(process.cwd(), '.')}:`))

    for (const result of results) {
      if (result.type === 'error') {
        this.println(
          indent(
            '\n'
            + chalk.red.bold(result.name.join(' › '))
            + '\n\n'
            + chalk.red(result.stack.split(`file://${process.cwd()}`).join('.'))
          )
        )
      }
    }

    this.println('')
  },
  onTestsComplete({ success, results, importFailures }) {
    if (success) {
      this.println(chalk.bold(chalk.bgGreen('                     ')))
      this.println(chalk.bold(chalk.bgGreen('  All tests passed!  ')))
      this.println(chalk.bold(chalk.bgGreen('                     ')))
      process.exit(0)
    } else {
      if (importFailures.length) {
        for (const { file, stack } of importFailures) {
          this.println('')
          this.println(chalk.bgRed.bold(` Failed to import ${file.replace(process.cwd(), '.')} `))
          this.println('')
          this.println(indent(chalk.red(stack)))
        }
        this.println('')
      }
      const failures = results
        .filter(x => x.type === 'error')
        .length
      if (failures.length) {
        const msg = `  ${failures} tests failed!  `
        this.println(chalk.bold(chalk.bgRed(' '.repeat(msg.length))))
        this.println(chalk.bold(chalk.bgRed(msg)))
        this.println(chalk.bold(chalk.bgRed(' '.repeat(msg.length))))
      } else {
        const msg = `  Failure  `
        this.println(chalk.bold(chalk.bgRed(' '.repeat(msg.length))))
        this.println(chalk.bold(chalk.bgRed(msg)))
        this.println(chalk.bold(chalk.bgRed(' '.repeat(msg.length))))
      }
      process.exit(1)
    }
  },
})

let reporter = defaultReporter

export function setReporter(newReporter) {
  assert(typeof newReporter === 'object' && newReporter, 'setReporter requires reporter to be an object')
  for (const key of Object.keys(defaultReporter))
    assert.equal(typeof newReporter[key], 'function', `reporter.${key} must be a function`)
  reporter = newReporter
}

export default async function runTests(pattern) {
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

function indent(str) {
  return str
    .split('\n')
    .map(line => '  ' + line)
    .join('\n')
}
