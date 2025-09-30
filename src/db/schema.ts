import { relations } from 'drizzle-orm';
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

export const usersRelations = relations(usersTable, ({ many }) => ({
  texts: many(textsTable),
}));

export const textsRelations = relations(textsTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [textsTable.authorId],
    references: [usersTable.id],
  }),
}));
