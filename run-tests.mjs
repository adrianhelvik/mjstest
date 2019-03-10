import clear from 'clear'
import chalk from 'chalk'

process.on('unhandledRejection', e =>{
  throw e
})

const phases = [
  [
    './tests/phase1/gatherSpecsFromFunc.mjs',
    './tests/phase1/gatherSpecs.mjs',
  ]
]

void async function () {
  clear()
  for (let i = 0; i < phases.length; i++) {
    const tests = phases[i]
    const errors = []
    console.log(chalk.gray(chalk.bold(`Running phase ${i+1} tests`)))
    for (const filename of tests) {
      try {
        await import(filename)
        process.stdout.write(chalk.green('·'))
      } catch (e) {
        errors.push({
          filename,
          stack: e.stack,
        })
        process.stdout.write(chalk.red('·'))
      }
    }
    if (errors.length) {
      for (const {filename, stack} of errors)
        console.error(chalk.red(`Failure in "${filename}":\n${chalk.red(chalk.bold(stack))}`))
    } else {
      console.log()
      console.log(chalk.green(chalk.bold(`All tests in phase ${i+1} passed`)))
    }
  }
}()
