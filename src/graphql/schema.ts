import { builder } from './builder';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { printSchema } from 'graphql';
import { usersTable } from '@/db/schema';
import { User } from 'lucide-react';

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

builder.mutationField('createUser', (t) =>
  t.field({
    type: UserRef,
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
    },
    resolve: async (_, { name, email }, { db }) => {
      const user: typeof usersTable.$inferInsert = { name, email };
      return { id: 1, name, email };
      const users = await db.insert(usersTable).values(user).returning();
      return users[0];
    },
  }),
);

export const schema = builder.toSchema();

console.log(printSchema(schema));
