import { writeFileSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { graphqlSchema } from '../src/graphql/schema';

const schemaAsString = printSchema(lexicographicSortSchema(graphqlSchema));

writeFileSync('schema.graphql', schemaAsString);

console.log('✅ GraphQL schema generated at schema.graphql');