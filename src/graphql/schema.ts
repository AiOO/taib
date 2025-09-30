import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull } from 'graphql';
import * as schema from '@/db/schema';

const db = drizzle(process.env.DATABASE_URL!, { schema });

// drizzle-graphql로 기본 스키마 생성
const { entities } = buildSchema(db);

// 커스텀 mutation 추가
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: entities.types.UsersItem,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { name, email }) => {
        const user: typeof schema.usersTable.$inferInsert = { name, email };
        const users = await db.insert(schema.usersTable).values(user).returning();
        return users[0];
      },
    },
  },
});

// 기존 자동 생성된 쿼리에 커스텀 mutation 추가
export const graphqlSchema = new GraphQLSchema({
  query: entities.queries.$Schema,
  mutation: MutationType,
});
