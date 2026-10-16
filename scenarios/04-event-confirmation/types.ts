import eventData from './events.json';

export const eventFixture = eventData.event;
export const participantFixture = eventData.participant;
export type EventDetails = typeof eventFixture;
export type Attendance =
  'pending' | 'confirmed' | 'not_attending' | 'undecided';
export const eventActions = [
  'confirm',
  'cancel',
  'reschedule',
  'undecided',
  'request_recording',
  'request_callback',
] as const;
export type EventAction = (typeof eventActions)[number];

export interface Registration {
  participantId: string;
  participantName: string;
  eventId: string;
  sessionId: string;
  status: 'registered' | 'cancelled';
  attendance: Attendance;
  recordingRequested: boolean;
  callbackRequested: boolean;
  callbackNote: string;
}

export interface EventSnapshot {
  sessionId: string;
  event: EventDetails;
  registration: Registration;
  revision: number;
  ended: boolean;
  updatedAt: string;
  lastAction: EventAction | null;
}

export interface EventUpdate {
  action: EventAction;
  requestId: string;
  newSessionId?: string;
  callbackNote?: string;
}

export function responseLabel(result: EventSnapshot) {
  if (result.registration.status === 'cancelled')
    return 'Registration cancelled';
  const labels: Record<Attendance, string> = {
    pending: result.ended ? 'No response recorded' : 'Awaiting your response',
    confirmed: 'Attendance confirmed',
    not_attending: 'Not attending live',
    undecided: 'Still deciding',
  };
  return labels[result.registration.attendance];
}

export function formatEventTime(startsAt: string) {
  return (
    new Intl.DateTimeFormat('en-US', {
      timeZone: eventFixture.timeZone,
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(new Date(startsAt))
  );
}
