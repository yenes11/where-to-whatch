import { NextRequest, NextResponse } from 'next/server';
import { searchMulti } from '@/lib/api-calls';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query || !query.trim()) {
    return NextResponse.json({
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0,
    });
  }

  try {
    const data = await searchMulti(query);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}

