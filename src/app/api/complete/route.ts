import { type NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { text, cursorPos, context, instructions } = await request.json();

    // Get context around cursor position
    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);

    // Create anthropic provider with the API key
    const anthropic = createAnthropic();

    const { text: completion } = await generateText({
      model: anthropic('claude-3-5-haiku-20241022'),
      messages: [
        {
          role: 'system',
          content: `You are an intelligent text completion assistant. Given the text before and after the cursor, provide a natural continuation that fits the context.

Rules:
- Provide only the completion text, no explanations
- Keep completions concise and relevant (1-3 sentences max)
- Match the writing style and tone of the existing text
- If the text appears to be code, provide appropriate code completions
- If the text is a list, continue the list format
- Follow any special instructions provided in the user message
- If context is provided in the user message, use it to inform your completion
- If unsure, provide a brief, helpful continuation`,
          providerOptions: {
            anthropic: {
              cacheControl: { type: 'ephemeral' }
            }
          }
        },
        {
          role: 'user',
          content: `Complete this text naturally:

${context ? `Additional Context: ${context}\n\n` : ''}${instructions ? `Special Instructions: ${instructions}\n\n` : ''}Text before cursor: "${beforeCursor}"
Text after cursor: "${afterCursor}"

Provide only the completion text that should be inserted at the cursor position:`
        }
      ],
      maxOutputTokens: 150,
    });

    return NextResponse.json({ completion: completion.trim() });
  } catch (error) {
    console.error('Completion error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate completion',
      },
      { status: 500 },
    );
  }
}
