import { drizzle } from 'drizzle-orm/node-postgres';
import SchemaBuilder from '@pothos/core';
import DrizzlePlugin from '@pothos/plugin-drizzle';
import { relations } from '@/db/schema';
import { getTableConfig } from 'drizzle-orm/pg-core';

const db = drizzle(process.env.DATABASE_URL!, { relations });

type DrizzleRelations = typeof relations;

export interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: {
    db: typeof db;
  };
}

export const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin],
  drizzle: {
    client: db,
    getTableConfig,
    relations,
  },
});

builder.queryType({});
builder.mutationType({});
