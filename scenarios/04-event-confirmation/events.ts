import eventData from './events.json';

export type EventStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'reschedule_requested';
export type EventAction = 'confirm' | 'cancel' | 'reschedule';

export interface EventRecord {
  eventId: string;
  title: string;
  startsAt: string;
  location: string;
  status: EventStatus;
  availableRescheduleTimes: string[];
}

interface EventActionResult {
  event: EventRecord;
  requestId: string;
  duplicate: boolean;
}

const events = new Map(
  (eventData.events as EventRecord[]).map((event) => [event.eventId, event]),
);
const requests = new Map<string, EventActionResult>();

export function getEvent(eventId: string): EventRecord | null {
  return events.get(eventId.trim().toUpperCase()) ?? null;
}

export function updateEvent(
  eventId: string,
  action: EventAction,
  requestId: string,
  newTime?: string,
): EventActionResult | { error: string } {
  const normalizedRequestId = requestId.trim();
  const previous = requests.get(normalizedRequestId);
  if (previous) return { ...previous, duplicate: true };

  const event = getEvent(eventId);
  if (!event) return { error: 'event_not_found' };
  if (event.status === 'cancelled') return { error: 'event_already_cancelled' };

  if (action === 'reschedule') {
    if (!newTime || !event.availableRescheduleTimes.includes(newTime)) {
      return { error: 'reschedule_time_unavailable' };
    }
    event.startsAt = newTime;
    event.status = 'reschedule_requested';
  } else if (action === 'confirm') {
    event.status = 'confirmed';
  } else {
    event.status = 'cancelled';
  }

  const result = { event, requestId: normalizedRequestId, duplicate: false };
  requests.set(normalizedRequestId, result);
  return result;
}
