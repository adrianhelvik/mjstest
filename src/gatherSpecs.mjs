import gatherSpecsFromFunc from './gatherSpecsFromFunc'
import getStack from 'callsite'
import path from 'path'

export default async function gatherSpecs(filename) {
  if (filename[0] !== '/') {
    const sourceFile = getStack()[1]
      .getFileName()
      .replace(/^file:\/\//, '')
    filename = path.resolve(sourceFile, '..', filename)
  }

  const specs = await gatherSpecsFromFunc(async () => {
    await import(filename)
  })

  return specs
}
