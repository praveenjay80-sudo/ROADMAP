import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const topic = searchParams.get('topic');
  const apiKey = request.headers.get('x-goog-api-key') || process.env.GOOGLE_API_KEY;

  if (!topic) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google API Key is required. Please provide it in the X-Goog-Api-Key header or set GOOGLE_API_KEY env var.' },
      { status: 401 }
    );
  }

  try {
    const roadmap = await generateRoadmap(topic, apiKey);
    return NextResponse.json(roadmap);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}
