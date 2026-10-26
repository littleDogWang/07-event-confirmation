import { responseLabel, type EventSnapshot } from './types';

function csvCell(value: unknown) {
  let text = String(value ?? '');
  // Keep user-entered notes from becoming formulas when opened in a spreadsheet.
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

export function eventResultCsv(result: EventSnapshot): string {
  const registration = result.registration;
  const slot = result.event.sessions.find(
    (item) => item.sessionId === registration.sessionId,
  )!;
  const fields = {
    event: result.event.title,
    event_id: registration.eventId,
    participant: registration.participantName,
    participant_id: registration.participantId,
    session: registration.sessionId,
    starts_at: slot.startsAt,
    timezone: result.event.timeZone,
    registration_status: registration.status,
    attendance: registration.attendance,
    result: responseLabel(result),
    recording_requested: registration.recordingRequested,
    callback_requested: registration.callbackRequested,
    callback_note: registration.callbackNote,
    last_action: result.lastAction ?? 'none',
    revision: result.revision,
    updated_at: result.updatedAt,
    session_ended: result.ended,
  };
  return (
    '\uFEFF' +
    Object.keys(fields).map(csvCell).join(',') +
    '\r\n' +
    Object.values(fields).map(csvCell).join(',') +
    '\r\n'
  );
}
