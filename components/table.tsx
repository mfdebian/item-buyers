import { db } from '@/lib/kysely'
import { timeAgo } from '@/lib/utils'
import RefreshButton from './refresh-button'
import { seed } from '@/lib/seed'

export default async function Table() {
  let items
  let startTime = Date.now()

  try {
    items = await db.selectFrom('items').selectAll().execute()
  } catch (e: any) {
    if (e.message === `relation "items" does not exist`) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      startTime = Date.now()
      items = await db.selectFrom('items').selectAll().execute()
    } else {
      throw e
    }
  }

  const duration = Date.now() - startTime

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent items</h2>
          <p className="text-sm text-gray-500">
            Fetched {items.length} items in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className="divide-y divide-gray-900/5">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <p className="font-medium leading-none">{item.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{timeAgo(item.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
