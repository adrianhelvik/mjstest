import chalk from 'chalk'
import runTests from '.'
import path from 'path'

const defaultPattern = './**/*.spec.mjs'
const testPattern = process.argv[2] || defaultPattern

const pattern = path.resolve(
  process.cwd(),
  testPattern,
)

setTimeout(() => {
  runTests(pattern)
}, 500)
