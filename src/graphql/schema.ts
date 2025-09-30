import { builder } from './builder';
import { printSchema } from 'graphql';
import { usersTable } from '@/db/schema';

const UserRef = builder.drizzleObject('usersTable', {
  name: 'User',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
  }),
});

const TextRef = builder.drizzleObject('textsTable', {
  name: 'Text',
  fields: (t) => ({
    content: t.exposeString('content'),
    context: t.exposeString('context'),
    instructions: t.exposeString('instructions'),
    author: t.relation('author'),
  }),
});

builder.queryField('users', (t) =>
  t.drizzleField({
    type: [UserRef],
    args: {
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (query, _, { limit, offset }, { db }) =>
      db.query.usersTable.findMany({
        ...query(),
        limit: limit ?? undefined,
        offset: offset ?? undefined,
      }),
  }),
);

builder.mutationField('createUser', (t) =>
  t.field({
    type: UserRef,
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
    },
    resolve: async (_, { name, email }, { db }) => {
      const user: typeof usersTable.$inferInsert = { name, email };
      const users = await db.insert(usersTable).values(user).returning();
      return users[0];
    },
  }),
);

export const schema = builder.toSchema();

console.log(printSchema(schema));
