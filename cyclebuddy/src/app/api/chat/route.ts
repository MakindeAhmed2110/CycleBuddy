import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'CycleBuddy',
  },
});

export async function POST(request: NextRequest) {
  try {
    const { message, userProfile } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create a context-aware prompt for period tracking and women's health
    const systemPrompt = `You are a helpful AI health assistant for CycleBuddy, a period tracking app that rewards women with crypto for managing their health. 

User Profile: ${userProfile ? JSON.stringify(userProfile) : 'No profile data available'}

Guidelines:
- Provide helpful, accurate information about menstrual health, cycle tracking, and general wellness
- Be supportive, non-judgmental, and professional
- Focus on period tracking, cycle predictions, symptom management, and reproductive health
- Mention that users earn B3TR crypto tokens for tracking their health data
- If asked about medical advice, recommend consulting healthcare professionals
- Keep responses concise but informative
- Use emojis occasionally to make responses friendly

Current conversation:`;

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' }, 
      { status: 500 }
    );
  }
}
