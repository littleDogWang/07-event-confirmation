import assert from 'node:assert/strict';
import { Agent } from 'agora-agents';
import { formatEventTime, responseLabel } from '../scenarios/04-event-confirmation/types';

assert.match(formatEventTime('2026-10-20T09:00:00-04:00'), /9:00 AM EDT/);
assert.match(formatEventTime('2026-12-20T09:00:00-05:00'), /9:00 AM EST/);
import { NextRequest } from 'next/server';
import {
  createEventSession,
  getEventSession,
  updateRegistration,
  finishEventSession,
  EventError,
} from '../scenarios/04-event-confirmation/events';
import { eventResultCsv } from '../scenarios/04-event-confirmation/export';
import { getScenarioTools } from '../scenarios/tool-contracts';
import {
  GET,
  POST,
} from '../app/api/scenarios/04-event-confirmation/events/route';
import {
  POST as sessionPost,
  GET as sessionGet,
} from '../app/api/scenarios/04-event-confirmation/sessions/route';
import { POST as invite } from '../app/api/invite-agent/route';

function fails(operation: () => unknown, code: string) {
  assert.throws(
    operation,
    (error: unknown) => error instanceof EventError && error.code === code,
  );
}

async function main() {
  const first = createEventSession();
  const other = createEventSession();
  const originalTimes = first.event.sessions.map((item) => item.startsAt);
  const changed = updateRegistration(first.sessionId, {
    action: 'reschedule',
    requestId: 'move',
    newSessionId: 'OCT-20-PM',
  });
  assert.equal(changed.result.registration.sessionId, 'OCT-20-PM');
  assert.equal(changed.result.registration.attendance, 'confirmed');
  assert.deepEqual(
    changed.result.event.sessions.map((item) => item.startsAt),
    originalTimes,
  );
  assert.equal(
    getEventSession(other.sessionId).registration.sessionId,
    'OCT-20-AM',
  );
  assert.equal(
    getEventSession(other.sessionId).registration.attendance,
    'pending',
  );
  fails(
    () =>
      updateRegistration(first.sessionId, {
        action: 'reschedule',
        requestId: 'bad-time',
        newSessionId: 'unavailable',
      }),
    'session_time_unavailable',
  );
  assert.equal(getEventSession(first.sessionId).revision, 1);

  updateRegistration(first.sessionId, {
    action: 'undecided',
    requestId: 'maybe',
  });
  const replay = updateRegistration(first.sessionId, {
    action: 'reschedule',
    requestId: 'move',
    newSessionId: 'OCT-20-PM',
  });
  assert.equal(replay.duplicate, true);
  assert.equal(replay.result.registration.attendance, 'confirmed');
  assert.equal(replay.result.revision, 1);
  assert.equal(
    getEventSession(first.sessionId).registration.attendance,
    'undecided',
  );
  fails(
    () =>
      updateRegistration(first.sessionId, {
        action: 'cancel',
        requestId: 'move',
      }),
    'request_id_conflict',
  );
  replay.result.registration.status = 'cancelled';
  assert.equal(
    getEventSession(first.sessionId).registration.status,
    'registered',
  );

  const recording = updateRegistration(first.sessionId, {
    action: 'request_recording',
    requestId: 'recording',
  });
  assert.equal(recording.result.registration.recordingRequested, true);
  assert.equal(recording.result.registration.attendance, 'not_attending');
  const callback = updateRegistration(first.sessionId, {
    action: 'request_callback',
    requestId: 'callback',
    callbackNote: '=SUM(1,2)\n"Tomorrow"',
  });
  assert.equal(callback.result.registration.callbackRequested, true);
  const csv = eventResultCsv(callback.result);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=SUM(1,2)\n""Tomorrow"""'));
  assert.ok(csv.includes('OCT-20-PM'));

  const cancelled = updateRegistration(other.sessionId, {
    action: 'cancel',
    requestId: 'cancel',
  });
  assert.equal(cancelled.result.registration.status, 'cancelled');
  fails(
    () =>
      updateRegistration(other.sessionId, {
        action: 'confirm',
        requestId: 'again',
      }),
    'registration_already_cancelled',
  );
  assert.deepEqual(
    getEventSession(other.sessionId).event.sessions.map(
      (item) => item.startsAt,
    ),
    originalTimes,
  );
  finishEventSession(first.sessionId);
  fails(
    () =>
      updateRegistration(first.sessionId, {
        action: 'confirm',
        requestId: 'ended',
      }),
    'session_ended',
  );
  fails(
    () =>
      updateRegistration(other.sessionId, {
        action: 'confirm',
        requestId: '  ',
      }),
    'invalid_registration_update',
  );
  fails(
    () => getEventSession('missing-session'),
    'session_expired_or_not_found',
  );
  const fresh = createEventSession();
  assert.equal(fresh.revision, 0);
  assert.equal(fresh.registration.recordingRequested, false);

  const request = (body: unknown, id?: string) =>
    new Request('http://localhost/api/scenarios/04-event-confirmation/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(id ? { 'x-event-session': id } : {}),
      },
      body: JSON.stringify(body),
    });
  assert.equal((await GET(new Request('http://localhost/events'))).status, 401);
  assert.equal(
    (await POST(request({ action: 'confirm', request_id: 'missing-header' })))
      .status,
    401,
  );
  assert.equal((await POST(request(null, fresh.sessionId))).status, 400);
  assert.equal(
    (
      await POST(
        request({ action: 'nope', request_id: 'invalid' }, fresh.sessionId),
      )
    ).status,
    400,
  );
  const apiUpdate = await POST(
    request({ action: 'confirm', request_id: 'api-confirm' }, fresh.sessionId),
  );
  assert.equal(apiUpdate.status, 200);
  assert.equal(
    (await apiUpdate.json()).result.registration.attendance,
    'confirmed',
  );
  const snapshot = await sessionGet(
    new Request('http://localhost/sessions', {
      headers: { 'x-event-session': fresh.sessionId },
    }),
  );
  assert.equal(snapshot.headers.get('Cache-Control'), 'no-store');
  assert.equal(
    (await snapshot.json()).result.registration.attendance,
    'confirmed',
  );
  assert.equal(
    (await sessionPost(request({ action: 'finish' }, fresh.sessionId))).status,
    200,
  );
  assert.equal(
    (
      await POST(
        request(
          { action: 'undecided', request_id: 'too-late' },
          fresh.sessionId,
        ),
      )
    ).status,
    409,
  );
  assert.equal((await sessionPost(request({ action: 'create' }))).status, 201);

  const tools = getScenarioTools(
    '04-event-confirmation',
    'https://events.example.com/',
    fresh.sessionId,
  );
  assert.equal(tools.length, 2);
  assert.equal(tools[0].server.headers?.['x-event-session'], fresh.sessionId);
  assert.equal(tools[1].server.body?.request_id, '{{tool_call_id}}');
  assert.ok(
    !Object.hasOwn(tools[1].function.parameters.properties ?? {}, 'session_id'),
  );
  assert.equal(
    getScenarioTools(
      '04-event-confirmation',
      'http://localhost:3000',
      fresh.sessionId,
    ).length,
    0,
  );
  const expired = createEventSession();
  const originalNow = Date.now;
  try {
    Date.now = () => originalNow() + 3 * 60 * 60 * 1000;
    fails(
      () => getEventSession(expired.sessionId),
      'session_expired_or_not_found',
    );
  } finally {
    Date.now = originalNow;
  }

  process.env.NEXT_PUBLIC_AGORA_APP_ID = '0123456789abcdef0123456789abcdef';
  process.env.NEXT_AGORA_APP_CERTIFICATE = 'fedcba9876543210fedcba9876543210';
  const priorBase = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL;
  delete process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL;
  const voiceReview = createEventSession();
  const originalCreateSession = Agent.prototype.createSession;
  Agent.prototype.createSession = (() => ({
    start: async () => 'mock-discussion-agent',
  })) as unknown as typeof Agent.prototype.createSession;
  try {
    const response = await invite(
      new NextRequest('http://localhost/api/invite-agent', {
        method: 'POST',
        body: JSON.stringify({
          requester_id: 'test-user',
          channel_name: 'test',
          event_session_id: voiceReview.sessionId,
        }),
      }),
    );
    assert.equal(
      response.status,
      200,
      'Missing REST tools must not block the voice conversation',
    );
    const body = await response.json();
    assert.equal(body.recording_available, false);
    assert.equal(body.agent_id, 'mock-discussion-agent');
    assert.equal(
      getEventSession(voiceReview.sessionId).revision,
      0,
      'Starting discussion must not record attendance intent',
    );
    assert.equal(
      responseLabel(finishEventSession(voiceReview.sessionId)),
      'No response recorded',
    );
  } finally {
    Agent.prototype.createSession = originalCreateSession;
    if (priorBase === undefined)
      delete process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL;
    else process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL = priorBase;
  }
  console.log(
    'Event registration, API isolation, idempotency, expiry, tool scoping and CSV checks passed',
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
