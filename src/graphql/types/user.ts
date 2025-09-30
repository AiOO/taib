import { builder } from '../builder';

export const User = builder.drizzleObject('usersTable', {
  name: 'User',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    texts: t.relation('texts'),
  }),
});