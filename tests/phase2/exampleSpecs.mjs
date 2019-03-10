import assert from 'assert'

it('can test before the suite', async () => {
  assert.equal('hello', 'world')
})

describe('a suite', () => {
  it('can contain a test case', async () => {
    assert.equal(1, 1)
  })

  it('can contain a failing test case', async () => {
    assert.equal(1, 2)
  })
})

it('can test after the suite', async () => {
  assert.equal('hello', 'hello')
})
