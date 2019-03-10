import gatherSpecs from '../../src/gatherSpecs.mjs'
import runSuite from '../../src/runSuite.mjs'
import assert from 'assert'
import path from 'path'

const dirname = path.resolve(new URL(import.meta.url).pathname, '..')

export default async () => {
  const specs = await gatherSpecs(
    path.resolve(
      dirname,
      'exampleSpecs.mjs'
    )
  )
  const eventResults = []
  const results = await runSuite(specs)
    .on('spec result', result => {
      eventResults.push(result)
    })

  // We had 4 test cases in the suite
  assert.equal(
    results.length,
    eventResults.length,
    'results should be equal to the event results'
  )
  assert.equal(
    results.length,
    4,
    `There should be 4 specs in total, got ${results.length}`,
  )

  for (const result of results) {
    if (result.type === 'error') {
      assert(typeof result.stack === 'string')
      delete result.stack // Don't do any more assertions on the stack
    } else {
      assert(result.type === 'success')
      assert(! ('stack' in result))
    }
  }

  assert.deepStrictEqual(
    results,
    [
      {
        type: 'error',
        name: ['can test before the suite'],
      },
      {
        type: 'success',
        name: ['a suite', 'can contain a test case'],
      },
      {
        type: 'error',
        name: ['a suite', 'can contain a failing test case'],
      },
      {
        type: 'success',
        name: ['can test after the suite'],
      }
    ]
  )
}
