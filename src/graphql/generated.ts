import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  getTextsByAuthorEmail?: Maybe<Array<Text>>;
  text?: Maybe<Text>;
  texts?: Maybe<Array<Text>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryGetTextsByAuthorEmailArgs = {
  emailPattern?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTextArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type Text = {
  __typename?: 'Text';
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['Int']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  context?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  instructions?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  texts?: Maybe<Array<Text>>;
};

export type GetTextsByAuthorEmailQueryVariables = Exact<{
  emailPattern?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTextsByAuthorEmailQuery = { __typename?: 'Query', getTextsByAuthorEmail?: Array<{ __typename?: 'Text', id?: string | null, content?: string | null, context?: string | null, instructions?: string | null, author?: { __typename?: 'User', id?: string | null, email?: string | null, name?: string | null } | null }> | null };


export const GetTextsByAuthorEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTextsByAuthorEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailPattern"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTextsByAuthorEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailPattern"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailPattern"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"context"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetTextsByAuthorEmailQuery, GetTextsByAuthorEmailQueryVariables>;