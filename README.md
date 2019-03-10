# mtest - A test runner for .mjs projects

**Important: beforeEach, afterEach, beforeAll and afterAll is not yet implemented**

We are at the point where we can use .mjs under the --experimental-modules flag.
The implementation may still change, but it's unlikely. I wanted a testframework
that was mjs-first instead of relying on babel.

# Interface

The globals exposed by the library are inspired by Jasmine.

```javascript
describe('hello world', () => {
  beforeEach(async () => {
    // ...
  })

  afterEach(async () => {
    // ...
  })

  beforeAll(async () => {
    // ...
  })

  afterAll(async () => {
    // ...
  })

  it('can run a test', async () => {
  })

  test('test === it', () => {
    expect(test).toBe(it)
  })
})
```
