import { builder } from './builder';
import './types/query';

export const graphqlSchema = builder.toSchema();