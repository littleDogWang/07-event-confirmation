import { NextResponse } from 'next/server';
import {
  getEvent,
  updateEvent,
  type EventAction,
} from '@/scenarios/04-event-confirmation/events';

export async function GET(request: Request) {
  const eventId = new URL(request.url).searchParams.get('event_id');
  if (!eventId) {
    return NextResponse.json({ error: 'event_id is required' }, { status: 400 });
  }
  const event = getEvent(eventId);
  return event
    ? NextResponse.json({ event })
    : NextResponse.json({ error: 'event_not_found' }, { status: 404 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event_id?: unknown;
      action?: unknown;
      request_id?: unknown;
      new_time?: unknown;
    };
    if (
      typeof body.event_id !== 'string' ||
      typeof body.request_id !== 'string' ||
      !['confirm', 'cancel', 'reschedule'].includes(String(body.action))
    ) {
      return NextResponse.json(
        { error: 'event_id, action, and request_id are required' },
        { status: 400 },
      );
    }
    const result = updateEvent(
      body.event_id,
      body.action as EventAction,
      body.request_id,
      typeof body.new_time === 'string' ? body.new_time : undefined,
    );
    if ('error' in result) {
      return NextResponse.json(result, { status: 409 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'invalid request' },
      { status: 400 },
    );
  }
}
