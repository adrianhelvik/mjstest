import chalk from 'chalk'

const FULL_CLEAR = '\x1b[2J'
const CLEAR = '\x1b[0f'

export default class DefaultReporter {
  setOptions(options) {
    this.options = options
  }

  print(message) {
    process.stdout.write(message)
  }

  println(message) {
    process.stdout.write(message + '\n')
  }

  onBeforeTests(files) {
    if (this.options.clear !== false) {
      this.print(FULL_CLEAR)
      this.print(CLEAR)
    }
    this.println(chalk.bold.gray('Running tests'))
    this.println('')
  }

  onBeforeFile(file) {
    const message = `${file.replace(process.cwd(), '.')}`
    this.println(chalk.bold(message))
  }

  onSpecResult(result) {
    if (result.type === 'success') {
      this.print(chalk.green('✓'))
    } else {
      this.print(chalk.red('✗'))
    }
  }

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
  }

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
  }
}

function indent(str) {
  return str
    .split('\n')
    .map(line => '  ' + line)
    .join('\n')
}
