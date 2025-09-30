import { graphql } from 'graphql';
import { graphqlSchema } from '../schema';

describe('GraphQL Schema - getTextsByAuthorEmail', () => {
  afterAll(async () => {
    // Jest가 종료될 수 있도록 타이머 대기
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  it('should have getTextsByAuthorEmail query', async () => {
    const query = `
      query {
        __type(name: "Query") {
          fields {
            name
          }
        }
      }
    `;

    const result = await graphql({ schema: graphqlSchema, source: query });
    const queryFields = result.data?.__type?.fields?.map((f: any) => f.name) || [];

    expect(queryFields).toContain('getTextsByAuthorEmail');
  });

  it('should execute getTextsByAuthorEmail query without errors', async () => {
    const query = `#graphql
      query GetTextsByAuthorEmail($emailPattern: String) {
        getTextsByAuthorEmail(emailPattern: $emailPattern) {
          content
          context
          instructions
          author {
            id
            email
            name
          }
        }
      }
    `;

    const result = await graphql({
      schema: graphqlSchema,
      source: query,
      variableValues: { emailPattern: 'test%' },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeDefined();
    expect(result.data?.getTextsByAuthorEmail).toBeDefined();
  });

  it('should return array type for getTextsByAuthorEmail', async () => {
    const query = `
      query {
        __type(name: "Query") {
          fields {
            name
            type {
              kind
              ofType {
                name
              }
            }
          }
        }
      }
    `;

    const result = await graphql({ schema: graphqlSchema, source: query });
    const queryFields = result.data?.__type?.fields || [];
    const getTextsByAuthorEmailField = queryFields.find((f: any) => f.name === 'getTextsByAuthorEmail');

    expect(getTextsByAuthorEmailField).toBeDefined();
    expect(getTextsByAuthorEmailField.type.kind).toBe('LIST');
  });
});
