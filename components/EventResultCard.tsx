'use client';

import { Check, Clock3, Download, FileVideo, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { eventResultCsv } from '@/scenarios/04-event-confirmation/export';
import {
  formatEventTime,
  responseLabel,
  type EventSnapshot,
} from '@/scenarios/04-event-confirmation/types';

export function EventResultCard({
  result,
  syncError,
}: {
  result: EventSnapshot;
  syncError: string | null;
}) {
  const registration = result.registration;
  const slot = result.event.sessions.find(
    (item) => item.sessionId === registration.sessionId,
  )!;
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([eventResultCsv(result)], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event-response-' + registration.participantId + '.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section
      id="event-result"
      className="event-result"
      role="region"
      aria-label="Your registration result"
    >
      <div className="event-section-heading">
        <span className="event-eyebrow">YOUR RESPONSE</span>
        <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
          {result.ended ? 'Reminder ended' : 'This conversation'}
        </span>
      </div>
      <div
        className="event-result-status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className={
            'event-result-icon ' +
            (registration.attendance === 'confirmed' ? 'is-confirmed' : '')
          }
        >
          {registration.attendance === 'confirmed' ? <Check /> : <Clock3 />}
        </div>
        <h2>{responseLabel(result)}</h2>
        <p>
          {result.revision === 0
            ? result.ended
              ? 'No registration changes were recorded during this call.'
              : 'Only confirmed registration updates appear here.'
            : 'Recorded for ' +
              registration.participantName +
              ' in this experience.'}
        </p>
      </div>
      <details className="event-response-details" open={result.ended}>
        <summary>Response details</summary>
        <dl className="event-result-details">
          <div>
            <dt>Participant</dt>
            <dd>{registration.participantName}</dd>
          </div>
          <div>
            <dt>Session</dt>
            <dd>{formatEventTime(slot.startsAt)}</dd>
          </div>
          <div>
            <dt>Registration</dt>
            <dd>
              {registration.status === 'registered' ? 'Active' : 'Cancelled'}
            </dd>
          </div>
          <div>
            <dt>Actual attendance</dt>
            <dd>Not tracked</dd>
          </div>
        </dl>
        {(registration.recordingRequested ||
          registration.callbackRequested) && (
          <div className="event-preferences">
            {registration.recordingRequested && (
              <p>
                <FileVideo />
                Recording interest recorded
              </p>
            )}
            {registration.callbackRequested && (
              <p>
                <Phone />
                Later contact requested
                {registration.callbackNote
                  ? ': ' + registration.callbackNote
                  : ''}
              </p>
            )}
            <span>
              Preferences only. No recording, email or callback has been sent or
              scheduled.
            </span>
          </div>
        )}
      </details>
      {syncError && (
        <p className="event-error" role="alert">
          {syncError} Showing your last confirmed response.
        </p>
      )}
      <div className="event-result-actions">
        <Button variant="outline" onClick={download}>
          <Download />
          Download CSV
        </Button>
      </div>
      <p className="event-footnote">
        Download a copy before refreshing or leaving. Your response is not
        stored permanently.
      </p>
    </section>
  );
}
