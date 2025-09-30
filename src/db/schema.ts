import { defineRelations } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const textsTable = pgTable('texts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar().notNull(),
  context: varchar().notNull(),
  instructions: varchar().notNull(),
  authorId: integer('author_id'),
});

export const relations = defineRelations({ usersTable, textsTable }, (t) => ({
  usersTable: {
    texts: t.many.textsTable({ from: t.usersTable.id, to: t.textsTable.authorId }),
  },
  textsTable: {
    author: t.one.usersTable({ from: t.textsTable.authorId, to: t.usersTable.id, optional: true }),
  },
}));