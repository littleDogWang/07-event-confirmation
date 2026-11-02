import { NextResponse } from 'next/server';

// Business data is not available in the conversation-only first version.
export async function GET(_request?: Request, _context?: unknown) {
  return NextResponse.json({ error: 'business_data_not_available', message: 'This first version provides voice conversation only.' }, { status: 410 });
}

export async function POST(_request?: Request, _context?: unknown) {
  return NextResponse.json({ error: 'business_data_not_available', message: 'This first version provides voice conversation only.' }, { status: 410 });
}
