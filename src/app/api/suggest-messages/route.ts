import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your .env file contains the correct key
});

// Specify the runtime
export const runtime = 'edge';

export async function POST() {
  try {
    const prompt =
     "Captain of indian cricket team"

    // Create the OpenAI streaming response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 10,
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    // Create a ReadableStream to handle the response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(new TextEncoder().encode(chunk.choices[0].delta.content || ''));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      return NextResponse.json(
        { message: 'An unexpected error occurred.'},
        { status: 500 }
      );
    }
  }
}
