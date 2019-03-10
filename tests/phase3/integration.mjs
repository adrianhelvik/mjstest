import runTests from '../../src/index.mjs'
import path from 'path'

const dirname = path.resolve(new URL(import.meta.url).pathname, '..')

export default async function () {
  await runTests(path.resolve(dirname, 'src/**/*.spec.mjs'))
}
