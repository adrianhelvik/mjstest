import integration from './tests/phase3/integration'

process.on('unhandledRejection', e => {
  throw e
})

main()

async function main() {
  await integration()
}
