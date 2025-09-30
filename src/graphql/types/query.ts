import { builder, db } from '../builder';
import { like, eq } from 'drizzle-orm';
import * as dbSchema from '../../db/schema';
import './user';
import './text';

builder.queryType({
  fields: (t) => ({
    // User 쿼리
    user: t.drizzleField({
      type: 'usersTable',
      nullable: true,
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: (query, _root, args) =>
        db.query.usersTable.findFirst({
          ...query,
          where: (user, { eq }) => eq(user.id, args.id),
        }),
    }),
    users: t.drizzleField({
      type: ['usersTable'],
      resolve: (query) => db.query.usersTable.findMany(query),
    }),

    // Text 쿼리
    text: t.drizzleField({
      type: 'textsTable',
      nullable: true,
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: (query, _root, args) =>
        db.query.textsTable.findFirst({
          ...query,
          where: (text, { eq }) => eq(text.id, args.id),
        }),
    }),
    texts: t.drizzleField({
      type: ['textsTable'],
      resolve: (query) => db.query.textsTable.findMany(query),
    }),

    // 커스텀 쿼리: getTextsByAuthorEmail
    getTextsByAuthorEmail: t.field({
      type: ['Text'],
      args: {
        emailPattern: t.arg.string(),
      },
      resolve: async (_root, args) => {
        const results = await db
          .select({
            id: dbSchema.textsTable.id,
            content: dbSchema.textsTable.content,
            context: dbSchema.textsTable.context,
            instructions: dbSchema.textsTable.instructions,
            authorId: dbSchema.textsTable.authorId,
            author: {
              id: dbSchema.usersTable.id,
              name: dbSchema.usersTable.name,
              email: dbSchema.usersTable.email,
            },
          })
          .from(dbSchema.textsTable)
          .leftJoin(
            dbSchema.usersTable,
            eq(dbSchema.usersTable.id, dbSchema.textsTable.authorId)
          )
          .where(like(dbSchema.usersTable.email, args.emailPattern || '%'));

        return results as any;
      },
    }),
  }),
});
