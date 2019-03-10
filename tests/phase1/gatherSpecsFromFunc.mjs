import gatherSpecsFromFunc from '../../src/gatherSpecsFromFunc'
import assert from 'assert'

async function main() {
  for (const spec of specs)
    await spec()
}

const specs = [
  async function itCanGatherSuites() {
    const result = await gatherSpecsFromFunc(() => {
      describe('foo', () => {
      })
    })

    assert.deepStrictEqual(result, {
      type: 'suite',
      name: '',
      children: [
        {
          type: 'suite',
          name: 'foo',
          children: [],
        }
      ]
    })
  },
  async function itCanGatherSpecs() {
    const fn = () => {}
    const result = await gatherSpecsFromFunc(() => {
      it('foo', fn)
    })

    assert.equal(result.children.length, 1)
    assert.equal(result.children[0].type, 'spec')
    assert.equal(result.children[0].name, 'foo')
    assert.equal(result.children[0].fn, fn)
  },
  async function itCanGatherBeforeEach() {
    const fn = () => {}
    const result = await gatherSpecsFromFunc(() => {
      beforeEach(fn)
    })
    assert.equal(result.children.length, 1)
    assert.equal(result.children[0].type, 'beforeEach')
    assert.equal(result.children[0].fn, fn)
  },
  async function itCanGatherAfterEach() {
    const fn = () => {}
    const result = await gatherSpecsFromFunc(() => {
      afterEach(fn)
    })
    assert.equal(result.children.length, 1)
    assert.equal(result.children[0].type, 'afterEach')
    assert.equal(result.children[0].fn, fn)
  },
  async function itCanGatherBeforeAll() {
    const fn = () => {}
    const result = await gatherSpecsFromFunc(() => {
      beforeAll(fn)
    })
    assert.equal(result.children.length, 1)
    assert.equal(result.children[0].type, 'beforeAll')
    assert.equal(result.children[0].fn, fn)
  },
  async function itCanGatherAfterAll() {
    const fn = () => {}
    const result = await gatherSpecsFromFunc(async () => {
      afterAll(fn)
    })
    assert.equal(result.children.length, 1)
    assert.equal(result.children[0].type, 'afterAll')
    assert.equal(result.children[0].fn, fn)
  },
]

export default main()
