import assert from 'assert'
import minus from './minus'

describe('minus', () => {
  it('can subtract [should fail]', () => {
    assert.strictEqual(minus(1, 1), 'not 0')
  })
})
