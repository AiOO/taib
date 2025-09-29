import { drizzle } from 'drizzle-orm/node-postgres';
import { type NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { usersTable } from '@/db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user: typeof usersTable.$inferInsert = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  await db.insert(usersTable).values(user);
  console.log('User inserted:', user);

  const users = await db.select().from(usersTable);
  console.log('All users', users);

  return NextResponse.json({});
}
