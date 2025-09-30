import type { InferSelectModel } from 'drizzle-orm';
import * as schema from '../db/schema';

// Drizzle 스키마에서 타입 추출
export type User = InferSelectModel<typeof schema.usersTable>;
export type Text = InferSelectModel<typeof schema.textsTable>;

// GraphQL 쿼리 응답 타입 (relations 포함)
export type TextWithAuthor = Text & {
  author: User | null;
};

export type UserWithTexts = User & {
  texts: Text[];
};