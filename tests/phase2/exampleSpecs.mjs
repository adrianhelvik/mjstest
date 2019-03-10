import assert from 'assert'

it('can test before the suite', async () => {
  assert.strictEqual('hello', 'world')
})

describe('a suite', () => {
  it('can contain a test case', async () => {
    assert.strictEqual(1, 1)
  })

  it('can contain a failing test case', async () => {
    assert.strictEqual(1, 2)
  })
})

it('can test after the suite', async () => {
  assert.strictEqual('hello', 'hello')
})
