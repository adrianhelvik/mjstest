import gatherSpecsFromFunc from './gatherSpecsFromFunc'

export default async function gatherSpecs(filename) {
  const specs = await gatherSpecsFromFunc(async () => {
    await import(filename)
  })

  return specs
}
