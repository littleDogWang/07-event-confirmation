import { randomUUID } from 'node:crypto';
import {
  eventFixture,
  participantFixture,
  eventActions,
  type EventSnapshot,
  type EventUpdate,
} from './types';

export class EventError extends Error {
  constructor(
    public code: string,
    public status = 409,
  ) {
    super(code);
  }
}

interface TemporarySession {
  snapshot: EventSnapshot;
  expiresAt: number;
  requests: Map<string, { input: string; result: EventSnapshot }>;
}

// Shared by Next.js route bundles in one Node process; never persisted to disk.
const runtime = globalThis as typeof globalThis & {
  eventConfirmationSessions?: Map<string, TemporarySession>;
};
const sessions: Map<string, TemporarySession> =
  (runtime.eventConfirmationSessions ??= new Map<string, TemporarySession>());
const lifetimeMs = 2 * 60 * 60 * 1000;

function getSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    throw new EventError('session_expired_or_not_found', 404);
  }
  return session;
}

export function createEventSession(): EventSnapshot {
  for (const [id, session] of sessions) {
    if (session.expiresAt <= Date.now()) sessions.delete(id);
  }
  const snapshot: EventSnapshot = {
    sessionId: randomUUID(),
    event: structuredClone(eventFixture),
    registration: {
      participantId: participantFixture.participantId,
      participantName: participantFixture.name,
      eventId: eventFixture.eventId,
      sessionId: eventFixture.sessions[0].sessionId,
      status: 'registered',
      attendance: 'pending',
      recordingRequested: false,
      callbackRequested: false,
      callbackNote: '',
    },
    revision: 0,
    ended: false,
    updatedAt: new Date().toISOString(),
    lastAction: null,
  };
  sessions.set(snapshot.sessionId, {
    snapshot,
    expiresAt: Date.now() + lifetimeMs,
    requests: new Map(),
  });
  return structuredClone(snapshot);
}

export function getEventSession(sessionId: string): EventSnapshot {
  return structuredClone(getSession(sessionId).snapshot);
}

export function finishEventSession(sessionId: string): EventSnapshot {
  const session = getSession(sessionId);
  session.snapshot.ended = true;
  return structuredClone(session.snapshot);
}

export function updateRegistration(
  sessionId: string,
  update: EventUpdate,
): { result: EventSnapshot; duplicate: boolean } {
  if (
    !eventActions.includes(update.action) ||
    typeof update.requestId !== 'string' ||
    !update.requestId.trim() ||
    update.requestId.length > 150 ||
    (update.callbackNote !== undefined &&
      (typeof update.callbackNote !== 'string' ||
        update.callbackNote.length > 500)) ||
    (update.newSessionId !== undefined &&
      typeof update.newSessionId !== 'string')
  ) {
    throw new EventError('invalid_registration_update', 400);
  }
  const session = getSession(sessionId);
  const input = JSON.stringify([
    update.action,
    update.newSessionId ?? '',
    update.callbackNote?.trim() ?? '',
  ]);
  const requestId = update.requestId.trim();
  const previous = session.requests.get(requestId);
  if (previous) {
    if (previous.input !== input) throw new EventError('request_id_conflict');
    return { result: structuredClone(previous.result), duplicate: true };
  }
  if (session.snapshot.ended) throw new EventError('session_ended');
  const next = structuredClone(session.snapshot);
  const registration = next.registration;
  if (registration.status === 'cancelled')
    throw new EventError('registration_already_cancelled');

  switch (update.action) {
    case 'confirm':
      registration.attendance = 'confirmed';
      break;
    case 'cancel':
      registration.status = 'cancelled';
      registration.attendance = 'not_attending';
      registration.callbackRequested = false;
      registration.callbackNote = '';
      break;
    case 'reschedule': {
      const target = next.event.sessions.find(
        (item) => item.sessionId === update.newSessionId && item.available,
      );
      if (!target) throw new EventError('session_time_unavailable');
      registration.sessionId = target.sessionId;
      registration.attendance = 'confirmed';
      break;
    }
    case 'undecided':
      registration.attendance = 'undecided';
      break;
    case 'request_recording':
      registration.recordingRequested = true;
      registration.attendance = 'not_attending';
      break;
    case 'request_callback':
      registration.callbackRequested = true;
      registration.callbackNote = update.callbackNote?.trim() ?? '';
      break;
  }
  next.revision += 1;
  next.updatedAt = new Date().toISOString();
  next.lastAction = update.action;
  session.snapshot = next;
  session.requests.set(requestId, { input, result: structuredClone(next) });
  return { result: structuredClone(next), duplicate: false };
}
