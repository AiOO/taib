import { createYoga } from 'graphql-yoga';
import { graphqlSchema } from '@/graphql/schema';

const { handleRequest } = createYoga({
  schema: graphqlSchema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
});

export { handleRequest as GET, handleRequest as POST };
