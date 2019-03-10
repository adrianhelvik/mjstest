import runTests from '.'
import path from 'path'

const pattern = path.resolve(
  process.cwd(),
  process.argv[2]
)

runTests(pattern)
