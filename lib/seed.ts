import { db, sql } from '@/lib/kysely'

export async function seed() {
  const createTable = await db.schema
    .createTable('items')
    .ifNotExists()
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('name', 'varchar(255)', (cb) => cb.notNull())
    .addColumn('image', 'varchar(255)')
    .addColumn('createdAt', sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`),
    )
    .execute()
  console.log(`Created "items" table`)
  const addItems = await db
    .insertInto('items')
    .values([
      {
        name: 'sword',
        image:
          'https://static.wikia.nocookie.net/tibia/images/1/1f/Sword.gif/revision/latest?cb=20120411043434&path-prefix=en&format=original',
      },
    ])
    .execute()
  console.log('Seeded database with 1 item')
  return {
    createTable,
    addItems,
  }
}
