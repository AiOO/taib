import SchemaBuilder from '@pothos/core';
import DrizzlePlugin from '@pothos/plugin-drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { getTableConfig } from 'drizzle-orm/pg-core';
import * as schema from '../db/schema';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  relations: schema.relations,
  logger: true
});

export interface PothosTypes {
  Drizzle: typeof db;
}

export const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin],
  drizzle: {
    client: db,
    getTableConfig,
  },
});