import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as loadDotenv } from 'dotenv'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envCandidates = [
  path.resolve(dirname, '../../.env.local'),
  path.resolve(dirname, '../../.env'),
  path.resolve(dirname, '../../../../.env.local'),
  path.resolve(dirname, '../../../../.env'),
  path.resolve(dirname, '../../../storefront/.env.local'),
  path.resolve(dirname, '../../../storefront/.env'),
]

for (const envPath of envCandidates) {
  loadDotenv({
    path: envPath,
    override: false,
  })
}

async function main() {
  const { syncMedusaProductsIntoPayload } = await import(
    '@/lib/medusa-product-sync'
  )
  const summary = await syncMedusaProductsIntoPayload()

  console.info(
    JSON.stringify(
      {
        ok: true,
        ...summary,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
