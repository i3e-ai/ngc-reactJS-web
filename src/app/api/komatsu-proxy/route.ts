// app/api/komatsu-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

const KOMATSU_API_BASE = 'https://www.komatsu.com/en-us/productlisting/parts';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build the target URL with all query parameters
    const targetUrl = new URL(KOMATSU_API_BASE);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    console.log('Proxying request to:', targetUrl.toString());

    // Fetch from Komatsu API
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Komatsu API returned ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch from Komatsu API',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
