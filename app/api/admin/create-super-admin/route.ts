import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/create-super-admin
 * 
 * Deprecated: Redirects to /api/admin/setup
 * This endpoint is maintained for backward compatibility
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body to forward
    const body = await request.json();
    
    // Create a new request to the setup endpoint
    const setupUrl = new URL('/api/admin/setup', request.url);
    
    const setupResponse = await fetch(setupUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const result = await setupResponse.json();
    
    return NextResponse.json(result, { status: setupResponse.status });
    
  } catch (error) {
    console.error('Create super admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create super admin'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/create-super-admin
 * 
 * Returns information about this deprecated endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'This endpoint is deprecated. Please use /api/admin/setup instead.',
    redirectTo: '/api/admin/setup',
    method: 'POST'
  }, { status: 410 }); // 410 Gone
}