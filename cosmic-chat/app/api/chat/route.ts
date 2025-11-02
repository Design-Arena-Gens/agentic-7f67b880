import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, apiEndpoint } = await request.json();

    // Support for Ollama and other OpenAI-compatible endpoints
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // Default model, can be configured
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();

    // Handle Ollama response format
    const content = data.message?.content || data.response || 'No response received';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with AI service' },
      { status: 500 }
    );
  }
}
