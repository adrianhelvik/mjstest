import assert from 'assert'
import minus from './minus'

describe('minus', () => {
  it('can subtract', () => {
    assert.strictEqual(minus(1, 1), 1)
  })
})
