import gatherSpecsFromFunc from './gatherSpecsFromFunc'
import path from 'path'

export default async function gatherSpecs(filename) {
  if (filename[0] !== '/')
    throw Error('You can only gather specs from absolute paths')

  const specs = await gatherSpecsFromFunc(async () => {
    await import(filename)
  })

  return specs
}
