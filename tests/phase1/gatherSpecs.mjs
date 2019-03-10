import gatherSpecs from '../../src/gatherSpecs'
import assert from 'assert'
import path from 'path'

async function main() {
  for (const spec of specs)
    await spec()
}

const specs = [
  async function run() {
    const dirname = path.resolve(
      new URL(import.meta.url).pathname, '..'
    )

    const filename = path.resolve(dirname, 'exampleSpecs.mjs')
    const suite = await gatherSpecs(filename)

    const stringified = JSON.stringify(suite, null, 2)

    assert.equal(suite.children[0].name, 'can test before')
    assert.equal(suite.children[1].name, 'a test suite')
    assert.equal(suite.children[1].children[0].name, 'first')
    assert.equal(suite.children[1].children[1].name, 'second')
    assert.equal(suite.children[2].name, 'can test after')
    assert.equal(suite.children.length, 3)
    assert.equal(suite.children[1].children.length, 2)
  }
]

export default main()
