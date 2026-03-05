import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FOOD_ANALYSIS_PROMPT, parseClaudeResponse } from '@/lib/claude';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ success: false, error: 'Missing imageBase64 or mimeType' }, { status: 400 });
    }

    // Instantiate inside the handler so process.env is fully loaded
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Strip data URI prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: FOOD_ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = parseClaudeResponse(rawText);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to analyze food';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
