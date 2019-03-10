export default async function gatherSpecsFromFunc(fn) {
  const suite = {
    type: 'suite',
    name: '',
    children: [],
    fn,
  }

  await gather(suite, '')

  return suite
}

async function gather(suite, name) {
  const beforeEach = global.beforeEach
  const afterEach = global.afterEach
  const beforeAll = global.beforeAll
  const afterAll = global.beforeAll
  const describe = global.describe
  const test = global.test
  const it = global.it

  global.describe = (name, fn) => {
    suite.children.push({
      type: 'suite',
      name,
      children: [],
      fn,
    })
  }

  global.it = global.test = (name, fn) => {
    suite.children.push({
      type: 'spec',
      name,
      fn,
    })
  }

  global.beforeEach = (fn) => {
    suite.children.push({
      type: 'beforeEach',
      fn,
    })
  }

  global.afterEach = (fn) => {
    suite.children.push({
      type: 'afterEach',
      fn,
    })
  }

  global.beforeAll = (fn) => {
    suite.children.push({
      type: 'beforeAll',
      fn,
    })
  }

  global.afterAll = (fn) => {
    suite.children.push({
      type: 'afterAll',
      fn,
    })
  }

  await suite.fn()
  delete suite.fn

  for (const child of suite.children) {
    if (child.type === 'suite') {
      await gather(child, name + child.name)
    }
  }

  global.beforeEach = beforeEach
  global.beforeAll = beforeAll
  global.afterEach = afterEach
  global.afterAll = afterAll
  global.describe = describe
  global.test = test
  global.it = it
}
