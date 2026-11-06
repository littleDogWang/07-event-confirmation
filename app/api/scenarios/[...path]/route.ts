import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    error: 'business_data_not_available',
    message: 'This version provides voice conversation only.',
  }, { status: 410 });
}

export const POST = GET;
