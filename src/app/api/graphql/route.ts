import { drizzle } from 'drizzle-orm/node-postgres';
import { createYoga } from 'graphql-yoga';
import { relations } from '@/db/schema';
import { schema } from '@/graphql/schema';
import { initContextCache } from '@pothos/core';

const db = drizzle(process.env.DATABASE_URL!, { relations });

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
  // context: async ({ request }) => ({
  context: async () => ({
    ...initContextCache(),
    db,
  }),
});

export { handleRequest as GET, handleRequest as POST };
