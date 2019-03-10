import clear from 'clear'
import chalk from 'chalk'

process.on('unhandledRejection', e =>{
  throw e
})
let exitStatus

const phases = [
  [
    './tests/phase1/gatherSpecsFromFunc.mjs',
    './tests/phase1/gatherSpecs.mjs',
  ],
  [
    './tests/phase2/runSpecsWithAssert.mjs',
  ],
  [
    async () => {
      process.exit = status => exitStatus = status
      console.log(
        chalk.black.bgYellow(
        )
      )
      let str = ''
      const write = process.stdout.write
      process.stdout.write = s => str += s
      try {
        await import('./tests/phase3/integration.mjs')
          .then(module => module.default())
      } finally {
        process.stdout.write = write
      }
      console.log()
      console.log(          chalk.black.bgYellow('                                   '))
      console.log(chalk.black.underline.bgYellow(' <output from integration of test> '))
      console.log(          chalk.black.bgYellow('                                   '))
      console.log(str)
      console.log(          chalk.black.bgYellow('                                    '))
      console.log(chalk.black.underline.bgYellow(' </output from integration of test> '))
      console.log(          chalk.black.bgYellow('                                    '))
      console.log(     chalk.bold.black.bgYellow('    Visually evaluate the result    '))
      console.log(          chalk.black.bgYellow('                                    '))
    },
  ],
]

void async function () {
  let success = true
  clear()
  for (let i = 0; i < phases.length; i++) {
    const tests = phases[i]
    const errors = []
    console.log(chalk.gray(chalk.bold(`Running phase ${i+1} tests`)))
    for (const filename of tests) {
      if (typeof filename === 'function') {
        await filename()
        continue
      }
      try {
        const value = await import(filename)
        if (typeof value.default === 'function')
          await value.default()
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
      success = false
      for (const {filename, stack} of errors)
        console.error(chalk.red(`Failure in "${filename}":\n${chalk.red(chalk.bold(stack))}`))
    } else {
      console.log()
      console.log(chalk.green(`All tests in phase ${i+1} passed`))
    }
  }
  if (success)
    console.log(chalk.green(chalk.bold('All tests passed')))
  else
    console.log(chalk.red(chalk.bold('Some tests failed')))
}()
