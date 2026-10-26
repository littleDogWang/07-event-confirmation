import { NextResponse } from 'next/server';
import { EventError } from './events';

export const sessionHeader = 'x-event-session';
export function requireEventSession(request: Request) {
  const id = request.headers.get(sessionHeader);
  if (!id) throw new EventError('event_session_required', 401);
  return id;
}
export function eventJson(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}
export function eventFailure(error: unknown) {
  if (error instanceof EventError)
    return eventJson({ error: error.code }, error.status);
  return eventJson({ error: 'invalid_request' }, 400);
}
