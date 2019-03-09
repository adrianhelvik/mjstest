# @adrianhelvik/test - A test runner for .mjs projects

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

# Implementation

## Loading specs and suites from a file
The first thing we do is collect all specs and suites. This is done by setting
up the global variables and importing the spec file. Then all the global
variables are set to null.

## Watching for changes intelligently
Running tests for all files when a single file changes is pointless. We want to
run tests for changed files only.

- Create a dependency graph from all test files
  - Use the import-graph package. No need to reinvent the wheel.
- Track changed files using chokidar
- Rerun tests with a dirty graph

## 
