import { builder } from '../builder';

export const Text = builder.drizzleObject('textsTable', {
  name: 'Text',
  fields: (t) => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    context: t.exposeString('context'),
    instructions: t.exposeString('instructions'),
    authorId: t.exposeInt('authorId', { nullable: true }),
    author: t.relation('author', { nullable: true }),
  }),
});